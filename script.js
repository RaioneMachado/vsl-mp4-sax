// ====== CONFIGURAÇÕES GLOBAIS ======
const CONFIG = {
    notifications: {
        interval: 30000, // 30 segundos
        messages: [
            '🎼 João comprou as vídeo partituras há 2 minutos',
            '🎵 Maria acessou o material há 1 minuto',
            '🎸 Carlos está baixando as partituras agora',
            '🎹 Ana comprou e recomendou para um amigo',
            '🎺 Pedro economizou 3 horas com nossa organização',
            '🎵 Beatriz disse que é a melhor compra que fez',
            '🎸 Lucas toca em 5 bandas com nossas partituras',
            '🎹 Rafael comprou o pacote completo',
            '🎼 Juliana adorou a praticidade das vídeo partituras',
            '🎵 Fernando economiza tempo em todas as apresentações'
        ]
    },
    countdown: {
        duration: 24 * 60 * 60 * 1000, // 24 horas
        elementId: 'countdown'
    }
};

// ====== UTILITÁRIOS ======
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

function scrollToDemo() {
    scrollToSection('demo');
}

// ====== ANIMAÇÕES AO SCROLL ======
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observar elementos para animação
    const animatedElements = document.querySelectorAll('.feature-card, .testimonial-card, .price-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// ====== NOTIFICAÇÕES DE COMPRA ======
class NotificationSystem {
    constructor() {
        this.notifications = CONFIG.notifications.messages;
        this.currentIndex = 0;
        this.init();
    }

    init() {
        this.showNotification();
        setInterval(() => {
            this.showNotification();
        }, CONFIG.notifications.interval);
    }

    showNotification() {
        const notification = this.createNotification();
        document.body.appendChild(notification);
        
        // Mostrar notificação
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        // Remover notificação após 4 segundos
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 4000);

        this.currentIndex = (this.currentIndex + 1) % this.notifications.length;
    }

    createNotification() {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `
            <div style="display: flex; align-items: center;">
                <div style="width: 8px; height: 8px; background: var(--accent-color); border-radius: 50%; margin-right: 10px; animation: pulse 2s infinite;"></div>
                <span>${this.notifications[this.currentIndex]}</span>
            </div>
        `;
        return notification;
    }
}

// ====== CONTADOR REGRESSIVO ======
class CountdownTimer {
    constructor(duration, elementId) {
        this.duration = duration;
        this.elementId = elementId;
        this.endTime = new Date().getTime() + duration;
        this.init();
    }

    init() {
        this.createElement();
        this.update();
        this.interval = setInterval(() => this.update(), 1000);
    }

    createElement() {
        const countdownEl = document.createElement('div');
        countdownEl.id = this.elementId;
        countdownEl.className = 'countdown-timer';
        countdownEl.innerHTML = `
            <div style="background: rgba(255,0,0,0.1); border: 2px solid #ff0000; border-radius: 10px; padding: 1rem; text-align: center; margin: 2rem 0;">
                <div style="color: #ff0000; font-weight: 600; margin-bottom: 0.5rem;">⏰ OFERTA ACABA EM:</div>
                <div id="countdown-display" style="font-size: 1.5rem; font-weight: 700; color: var(--text-light);"></div>
            </div>
        `;
        
        // Inserir após o título da seção de preços
        const priceSection = document.getElementById('preco');
        if (priceSection) {
            priceSection.insertBefore(countdownEl, priceSection.firstChild);
        }
    }

    update() {
        const now = new Date().getTime();
        const distance = this.endTime - now;

        if (distance < 0) {
            clearInterval(this.interval);
            document.getElementById('countdown-display').innerHTML = "OFERTA EXPIRADA";
            return;
        }

        const hours = Math.floor(distance / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('countdown-display').innerHTML = 
            `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
}

// ====== FAQ TOGGLE ======
function toggleFAQ(element) {
    const faqItem = element.parentElement;
    const isActive = faqItem.classList.contains('active');
    
    // Fechar todos os FAQs
    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Se não estava ativo, abrir este
    if (!isActive) {
        faqItem.classList.add('active');
    }
}

// ====== MODAL FUNCTIONS ======
function openCheckout() {
    // Criar urgência com contador
    if (!window.countdownTimer) {
        window.countdownTimer = new CountdownTimer(CONFIG.countdown.duration, CONFIG.countdown.elementId);
    }
    
    document.getElementById('checkoutModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Focar no primeiro campo
    setTimeout(() => {
        const firstInput = document.querySelector('#checkoutForm input');
        if (firstInput) firstInput.focus();
    }, 100);
}

function closeCheckout() {
    document.getElementById('checkoutModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// ====== VIDEO DEMO ======
function playDemo() {
    const videoContainer = document.querySelector('.video-placeholder');
    const iframe = document.createElement('div');
    iframe.innerHTML = `
        <iframe width="100%" height="100%" 
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" 
                title="Demonstração de Vídeo Partituras" 
                frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen
                style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;">
        </iframe>
    `;
    videoContainer.innerHTML = '';
    videoContainer.appendChild(iframe);
    videoContainer.style.cursor = 'default';
}

// ====== FORM HANDLING ======
function handleFormSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Simular processamento
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processando...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        // Simular sucesso
        alert('✅ Compra realizada com sucesso! Você receberá o acesso no email informado.');
        closeCheckout();
        form.reset();
        
        // Adicionar à lista de compras simuladas
        const newMessage = `🎉 ${data.nome.split(' ')[0]} comprou as vídeo partituras agora!`;
        CONFIG.notifications.messages.unshift(newMessage);
        
    }, 2000);
}

// ====== HEADER SCROLL EFFECT ======
function initHeaderScroll() {
    const header = document.getElementById('header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.style.background = 'rgba(10, 10, 10, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(0, 212, 255, 0.2)';
        } else {
            header.style.background = 'rgba(10, 10, 10, 0.95)';
            header.style.boxShadow = 'none';
        }
        
        lastScroll = currentScroll;
    });
}

// ====== EXIT INTENT ======
function initExitIntent() {
    let exitIntentShown = sessionStorage.getItem('exitIntentShown');
    
    if (!exitIntentShown) {
        document.addEventListener('mouseleave', (e) => {
            if (e.clientY <= 0) {
                showExitIntent();
                sessionStorage.setItem('exitIntentShown', 'true');
            }
        });
    }
}


// ====== PARALLAX EFFECT ======
function initParallax() {
    const bg = document.querySelector('.animated-bg');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        bg.style.transform = `translateY(${rate}px)`;
    });
}

// ====== INITIALIZATION ======
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar sistemas
    initScrollAnimations();
    initHeaderScroll();
    initParallax();
    
    // Delay na notificação para não ser intrusivo
    setTimeout(() => {
        new NotificationSystem();
    }, 5000);
    
    // Inicializar formulário
    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', handleFormSubmit);
    }
    
    // Inicializar exit intent após 30 segundos
    setTimeout(() => {
        initExitIntent();
    }, 30000);
    
    // Adicionar efeito de hover nos botões
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.05)';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// ====== MOBILE MENU ======
function toggleMobileMenu() {
    const nav = document.querySelector('nav ul');
    nav.classList.toggle('mobile-active');
}

// ====== SMOOTH SCROLL FOR ANCHOR LINKS ======
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ====== ANALYTICS ======
function trackEvent(eventName, properties = {}) {
    console.log('Event tracked:', eventName, properties);
    // Aqui você pode integrar com Google Analytics, Facebook Pixel, etc.
}

// Tracking automático
document.addEventListener('click', function(e) {
    if (e.target.closest('.btn-primary')) {
        trackEvent('cta_click', {
            text: e.target.textContent,
            location: e.target.closest('section')?.id || 'unknown'
        });
    }
});

// Exportar funções globais
window.openCheckout = openCheckout;
window.closeCheckout = closeCheckout;
window.playDemo = playDemo;
window.toggleFAQ = toggleFAQ;
window.scrollToDemo = scrollToDemo;
// ====== VIDEO EMBED SYSTEM ======
function initVideoEmbeds() {
    const videoContainers = document.querySelectorAll('.video-container-embed');
    
    videoContainers.forEach(container => {
        container.addEventListener('click', function() {
            const videoId = this.getAttribute('data-video-id');
            const placeholder = this.querySelector('.video-placeholder');
            const iframeContainer = this.querySelector('.video-iframe-container');
            const iframe = iframeContainer.querySelector('iframe');
            const loadingSpinner = this.querySelector('.loading-spinner');
            
            // Mostrar loading
            this.classList.add('loading');
            
            // Configurar e carregar o iframe
            iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;
            
            // Quando o vídeo carregar
            iframe.addEventListener('load', () => {
                this.classList.remove('loading');
                this.classList.add('video-loaded');
            });
            
            // Fallback - remover loading após 5 segundos
            setTimeout(() => {
                this.classList.remove('loading');
                if (!this.classList.contains('video-loaded')) {
                    this.classList.add('video-loaded');
                }
            }, 5000);
        });
    });
}

// Pausar outros vídeos quando um novo é reproduzido
function pauseOtherVideos(currentContainer) {
    const allContainers = document.querySelectorAll('.video-container-embed.video-loaded');
    allContainers.forEach(container => {
        if (container !== currentContainer) {
            const iframe = container.querySelector('iframe');
            if (iframe && iframe.contentWindow) {
                // Tentar pausar o vídeo
                iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
            }
        }
    });
}

// Observar mudanças nos vídeos
document.addEventListener('DOMContentLoaded', function() {
    initVideoEmbeds();
    
    // Observar cliques nos vídeos para pausar outros
    document.addEventListener('click', function(e) {
        const videoContainer = e.target.closest('.video-container-embed');
        if (videoContainer) {
            setTimeout(() => {
                if (videoContainer.classList.contains('video-loaded')) {
                    pauseOtherVideos(videoContainer);
                }
            }, 1000);
        }
    });
});

// Função para resetar todos os vídeos
function resetAllVideos() {
    const videoContainers = document.querySelectorAll('.video-container-embed');
    videoContainers.forEach(container => {
        container.classList.remove('video-loaded', 'loading');
        const iframe = container.querySelector('iframe');
        if (iframe) {
            iframe.src = '';
        }
    });
}