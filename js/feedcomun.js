// ==========================================
// 1. CONFIGURAÇÕES E UTILITÁRIOS GERAIS
// ==========================================
const API_URL = 'http://localhost:3000'; 
const token = localStorage.getItem('access_token'); 

const urlParams = new URLSearchParams(window.location.search);
const comunidadeId = urlParams.get('id');

const fetchConfig = {
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
};

function gerarCorPastel() {
    const r = Math.floor(Math.random() * 127 + 128);
    const g = Math.floor(Math.random() * 127 + 128);
    const b = Math.floor(Math.random() * 127 + 128);
    return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

// ==========================================
// 2. INTERFACE DO USUÁRIO (MENU DROPDOWN)
// ==========================================
const userTrigger = document.querySelector('.user-trigger');
const userDropdown = document.getElementById('dropdownNotificacao'); // Ajustado para bater com o ID do seu HTML (ou crie um id="userDropdown" no menu do usuário)

if (userTrigger && userDropdown) {
    userTrigger.addEventListener('click', () => {
        userDropdown.classList.toggle('active');
    });
}

// ==========================================
// 3. LÓGICA DE POSTAGEM (EVENTO DE FORMULÁRIO)
// ==========================================
const formPost = document.querySelector('.new-post-card'); // Pegamos o formulário
const postInput = document.getElementById('post-input');
const btnPostar = document.querySelector('.btn-postar'); // Pegamos pela classe, como está no HTML
const timeline = document.getElementById('timeline-posts');

if (formPost && postInput && timeline) {
    // Usamos o evento de 'submit' no formulário em vez de clique no botão
    formPost.addEventListener('submit', async (event) => {
        event.preventDefault(); // ISSO É CRÍTICO: Impede a página de recarregar!

        const conteudo = postInput.value.trim();
        
        if (conteudo === "") return;
        
        // Como o botão é um <input>, pegamos o texto dele por ".value"
        const textoOriginalBotao = btnPostar.value;
        btnPostar.value = "Postando...";
        btnPostar.disabled = true;

        try {
            const response = await fetch(`${API_URL}/posts`, {
                method: 'POST',
                headers: fetchConfig.headers,
                body: JSON.stringify({
                    content: conteudo,
                    communityId: comunidadeId
                })
            });

            if (!response.ok) {
                const erro = await response.json();
                throw new Error(erro.message || "Erro ao criar o post.");
            }

            // Injeta o post no topo da tela visualmente
            const novoPost = document.createElement('article');
            novoPost.className = 'post';
            novoPost.innerHTML = `
                <div class="post-user">
                    <i class="fa-regular fa-circle-user avatar"></i>
                    <div class="user-data">
                        <strong>Você</strong>
                        <span>@seu_usuario</span>
                    </div>
                    <div class="post-info">
                        <span>Postado agora</span>
                    </div>
                </div>
                <p class="post-text">${conteudo}</p>
                <div class="post-stats">
                    <span><i class="fa-regular fa-thumbs-up"></i> 0</span>
                    <span><i class="fa-regular fa-comment"></i> 0</span>
                </div>
            `;
            
            // Se a timeline só tiver a mensagem de "nenhum post", limpamos ela
            if (timeline.querySelector('p') && timeline.children.length === 1) {
                timeline.innerHTML = '';
            }

            timeline.prepend(novoPost); 
            postInput.value = ""; // Limpa o input

        } catch (error) {
            console.error("Falha ao postar:", error);
            alert(`Não foi possível enviar o post: ${error.message}`);
        } finally {
            btnPostar.value = textoOriginalBotao;
            btnPostar.disabled = false;
        }
    });
}

// ==========================================
// 4. BUSCA DE DADOS (COMUNIDADE E FEED)
// ==========================================
async function carregarComunidade() {
    if (!comunidadeId) return;

    try {
        const response = await fetch(`${API_URL}/community/${comunidadeId}`, fetchConfig);
        if (!response.ok) throw new Error('Erro ao buscar comunidade');
        
        const comunidade = await response.json();

        document.getElementById('comunidade-nome').textContent = comunidade.name;
        document.getElementById('comunidade-desc').textContent = comunidade.description;
        document.getElementById('comunidade-autor').textContent = `@${comunidade.author?.username || 'desconhecido'}`;
        
        // Aplica a cor pastel na tag <img> caso ela não tenha src
        const capaImg = document.getElementById('comunidade-capa');
        if(capaImg) {
            capaImg.style.backgroundColor = gerarCorPastel();
        }
        
        const dataCriacao = new Date(comunidade.createdAt).toLocaleDateString('pt-BR', {
            day: '2-digit', month: 'long', year: 'numeric'
        });
        document.getElementById('comunidade-data').textContent = `Em ${dataCriacao}`;

    } catch (error) {
        console.error("Erro ao carregar os dados da comunidade:", error);
    }
}

async function carregarPosts(pagina = 1) {
    if (!comunidadeId) return;

    try {
        const response = await fetch(`${API_URL}/community/${comunidadeId}/posts?page=${pagina}&limit=10`, fetchConfig);
        if (!response.ok) throw new Error('Erro ao buscar posts');

        const result = await response.json();
        
        // Quando carregar com sucesso, limpa os posts falsos/hardcoded do HTML
        if (pagina === 1) timeline.innerHTML = '';

        if (result.data.length === 0) {
            timeline.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">Nenhum post encontrado nesta comunidade.</p>';
            return;
        }

        result.data.forEach(post => {
            const dataHora = new Date(post.createdAt).toLocaleTimeString('pt-BR', {
                hour: '2-digit', minute:'2-digit'
            });

            const authorName = post.user ? post.user.username : 'Usuário Oculto';

            const article = document.createElement('article');
            article.className = 'post';
            article.innerHTML = `
                <div class="post-user">
                    <i class="fa-regular fa-circle-user avatar"></i>
                    <div class="user-data">
                        <strong>${authorName}</strong>
                        <span>@${authorName}</span>
                    </div>
                    <div class="post-info">
                        <span>Postado às ${dataHora}</span><br>
                    </div>
                </div>
                <p class="post-text">${post.content}</p>
                <div class="post-stats">
                    <span><i class="fa-regular fa-thumbs-up"></i> 0</span>
                    <span><i class="fa-regular fa-comment"></i> 0</span>
                </div>
            `;
            timeline.appendChild(article);
        });

    } catch (error) {
        console.error("Erro ao carregar o feed:", error);
        timeline.innerHTML = '<p style="text-align: center;">Erro ao carregar o feed.</p>';
    }
}

// ==========================================
// 5. INICIALIZAÇÃO DA PÁGINA
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    if (!comunidadeId) {
        console.warn('Nenhum ID de comunidade detectado na URL.');
        // Opcional: window.location.href = 'comunidades.html';
        return; 
    }
    
    carregarComunidade();
    carregarPosts(1);
});