// Abrir dropdown do usuário (seu HTML original)
const userTrigger = document.querySelector('.user-trigger');
const userDropdown = document.getElementById('userDropdown');

if(userTrigger) {
    userTrigger.addEventListener('click', () => {
        userDropdown.classList.toggle('active');
    });
}

// Lógica de postagem simples
const btnPostar = document.querySelector('.btn-postar');
const textarea = document.querySelector('textarea');
const timeline = document.querySelector('.timeline');

btnPostar.addEventListener('click', () => {
    if(textarea.value.trim() !== "") {
        const novoPost = document.createElement('article');
        novoPost.className = 'post';
        novoPost.innerHTML = `
            <div class="post-user">
                <i class="fa-regular fa-circle-user avatar" style="font-size: 40px"></i>
                <div class="user-data">
                    <strong>João A B</strong>
                    <span>@joao_ab</span>
                </div>
                <span class="time">agora</span>
            </div>
            <p class="post-text">${textarea.value}</p>
            <div class="post-stats">
                <span><i class="fa-regular fa-thumbs-up"></i> 0</span>
                <span><i class="fa-regular fa-comment"></i> 0</span>
            </div>
        `;
        timeline.prepend(novoPost);
        textarea.value = "";
    }
});