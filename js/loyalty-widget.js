(function(){

// Rutas que NO deben mostrar el widget
const EXCLUDE_PATTERNS = ['ingresar','login','crear-usuario','registro']; 

// helpers
function pathExcluded(){
    const p = window.location.pathname.toLowerCase();
    return EXCLUDE_PATTERNS.some(s => p.includes(s));
}

function getAuthToken(){
    return localStorage.getItem('authToken') || null; 
}

// DOM creation
let widgetEl = null;
let offcanvasEl = null;

// Inyectar estilos CSS para el tema gamer
function injectStyles(){
    const styleId = 'gamer-loyalty-styles';
    if(document.getElementById(styleId)) return;
    
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
        @import url('https://fonts.googleapis.com/css2?family=Pixelify+Sans:wght@400;500;600;700&family=Roboto:wght@400;500;600&display=swap');
        
        :root{
        --levelup-purple: #f90000;
        --gradient-gaming: linear-gradient(45deg,#f3f1f7,#ec4899);
        }

        .loyalty-float-btn {
            position: fixed;
            bottom: 180px;
            left: 25px;
            z-index: 1050¿;
            background: linear-gradient(135deg, #FF1493, #FFD700);
            border: none;
            border-radius: 50px;
            padding: 12px 20px;
            box-shadow: 0 8px 25px rgba(255, 20, 147, 0.4);
            cursor: pointer;
            transition: all 0.3s ease;
            animation: float 3s ease-in-out infinite;
            position: fixed;
            position: fixed;
            bottom: 120px;
            left: 25px; 
            z-index: 9999;
            font-size: 0.9rem;
             
    
            /* Apariencia del botón */
            background: var(--gradient-gaming);
            color: white; /* Texto blanco para alto contraste */

            border-radius: 60px;
            padding: 10px 14px;
            box-shadow: 0 10px 12px rgba(49, 17, 123, 0.35);
            cursor: pointer;
            border: none;

            /* Flexbox para alinear el ícono y el texto */
            display: flex;
            align-items: center;
            gap: 10px;
            user-select: none;

            /* Animación de "latido" */
            animation: pulse 2s infinite;
        }
        
        .loyalty-float-btn:hover {
            transform: translateY(-5px);
            box-shadow: 0 12px 35px rgba(255, 20, 147, 0.6);
        }
        
        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
        }
        
        .gamer-offcanvas {
            background: linear-gradient(180deg, #4B0082 0%, #2E0854 100%);
            color: white;
            font-family: 'Pixelify Sans', sans-serif;
        }
        
        .gamer-offcanvas .offcanvas-header {
            background: linear-gradient(90deg, #FF1493, #FFD700);
            border-bottom: 3px solid #FFD700;
        }
        
        .gamer-title {
            font-family: 'Pixelify Sans', sans-serif;
            font-size: 1.8rem;
            font-weight: 700;
            color: #000;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        
        .gamer-subtitle {
            font-family: 'Pixelify Sans', sans-serif;
            font-size: 1.2rem;
            font-weight: 600;
            color: #FFD700;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
        }
        
        .join-section {
            background: linear-gradient(135deg, #FF1493, #FFD700);
            border-radius: 15px;
            padding: 20px;
            margin: 20px 0;
            text-align: center;
            box-shadow: 0 8px 20px rgba(255, 20, 147, 0.3);
        }
        
        .join-title {
            font-family: 'Pixelify Sans', sans-serif;
            font-size: 1.3rem;
            font-weight: 700;
            color: #000;
            margin-bottom: 10px;
            text-shadow: 1px 1px 2px rgba(255,255,255,0.3);
        }
        
        .gamer-btn {
            background: linear-gradient(135deg, #FFD700, #FFA500);
            border: 2px solid #FFD700;
            color: #000;
            font-family: 'Pixelify Sans', sans-serif;
            font-weight: 600;
            padding: 12px 25px;
            border-radius: 25px;
            text-decoration: none;
            display: inline-block;
            margin: 10px 5px;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(255, 215, 0, 0.4);
        }
        
        .gamer-btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 20px rgba(255, 215, 0, 0.6);
            color: #000;
        }
        
        .login-text {
            font-family: 'Roboto', sans-serif;
            font-size: 0.9rem;
            color: #FFD700;
            margin-top: 15px;
        }
        
        .login-link {
            color: #FF1493;
            font-weight: 600;
            text-decoration: underline;
            cursor: pointer;
        }
        
        .login-link:hover {
            color: #FFD700;
        }
        
        .coins-display {
            background: rgba(255, 215, 0, 0.1);
            border: 2px solid #FFD700;
            border-radius: 15px;
            padding: 20px;
            text-align: center;
            margin: 20px 0;
        }
        
        .coins-amount {
            font-family: 'Pixelify Sans', sans-serif;
            font-size: 2.5rem;
            font-weight: 700;
            color: #FFD700;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
        }
        
        .discounts-section {
            background: #4B0082;
            border-radius: 15px;
            padding: 20px;
            margin: 20px 0;
            border: 2px solid #FFD700;
        }
        
        .discount-image {
            width: 80px;
            height: 80px;
            margin: 0 auto 15px;
            background: linear-gradient(135deg, #FFD700, #FFA500);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2rem;
        }
        
        .discount-title {
            font-family: 'Roboto', sans-serif;
            font-size: 1.1rem;
            font-weight: 700;
            color: #FFD700;
            margin-bottom: 5px;
        }
        
        .discount-count {
            font-family: 'Roboto', sans-serif;
            font-size: 0.9rem;
            color: #FF1493;
            margin-bottom: 10px;
        }
        
        .discount-link {
            font-family: 'Roboto', sans-serif;
            font-size: 0.8rem;
            color: #FFD700;
            text-decoration: underline;
            cursor: pointer;
        }
        
        .loading-spinner {
            border: 3px solid rgba(255, 215, 0, 0.3);
            border-radius: 50%;
            border-top: 3px solid #FFD700;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin: 20px auto;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .btn-close {
            filter: invert(1);
        }
    `;
    document.head.appendChild(style);
}

function createWidget(){
    if(pathExcluded()) return; 
    
    // Inyectar estilos 
    injectStyles();
    
    widgetEl = document.createElement('div');
    widgetEl.className = 'loyalty-float-btn'; 
    widgetEl.setAttribute('data-bs-toggle', 'offcanvas');
    widgetEl.setAttribute('data-bs-target', '#loyaltyOffcanvas');
    widgetEl.setAttribute('aria-controls', 'loyaltyOffcanvas');
    
    widgetEl.innerHTML = `
        <div class="d-flex align-items-center">
            <img src="/img/coin-flip-59.gif" alt="btnFidelizacion" class="coin-icon-points" width="30" height="20">  
            <div class="btn-text ms-2">
                <strong style="color: #000; font-family: 'Pixelify Sans', sans-serif;">Mis Coins</strong>
            </div>
        </div>
    `;

    document.body.appendChild(widgetEl);
    
    // Crear el offcanvas si no existe
    createOffcanvas();
}

// Crear el elemento offcanvas con diseño gamer
function createOffcanvas(){
    // Verificar si ya existe
    if(document.getElementById('loyaltyOffcanvas')) return;
    
    offcanvasEl = document.createElement('div');
    offcanvasEl.className = 'offcanvas offcanvas-end gamer-offcanvas';
    offcanvasEl.id = 'loyaltyOffcanvas';
    offcanvasEl.setAttribute('tabindex', '-1');
    offcanvasEl.setAttribute('aria-labelledby', 'loyaltyOffcanvasLabel');
    offcanvasEl.style.width = '400px';
    
    offcanvasEl.innerHTML = `
        <div class="offcanvas-header">
            <h5 class="offcanvas-title gamer-title" id="loyaltyOffcanvasLabel">
                LEVEL-UP: GAMER
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div class="offcanvas-body">
            <div id="lwp-modal-content">
                <!-- Contenido dinámico aquí -->
            </div>
        </div>
    `;
    
    document.body.appendChild(offcanvasEl);
}

// Función para mostrar la vista de usuario no logueado
function showGuestView(){
    const modalContent = document.querySelector('#lwp-modal-content');
    
    modalContent.innerHTML = `
        <!-- Sección de registro -->
        <div class="join-section">
            <div class="join-title">Únete y empieza a ganar coins</div>
            <p style="color: #000; font-family: 'Roboto', sans-serif; margin: 10px 0;">
                Recibe ofertas exclusivas de nuestro programa de fidelización
            </p>
            <a href="/ingresar.html" class="gamer-btn">
                ¡ÚNETE AHORA!
            </a>
            <div class="login-text">
                Ya tengo cuenta 
                <span class="login-link" onclick="window.location.href='/ingresar.html'">
                    Registrarme
                </span>
            </div>
        </div>

        <!-- Sección de descuentos -->
        <div class="discounts-section">
            <div class="text-center">
                <div class="discount-image">
                    💰
                </div>
                <div class="discount-title">OBTENGA DESCUENTOS</div>
                <div class="discount-count">0 descuentos</div>
                <div class="discount-link" onclick="alert('¡Regístrate para ver más descuentos!')">
                    ver más
                </div>
            </div>
        </div>
    `;
}

// Función para mostrar la vista de usuario logueado
function showUserView(user){
    const modalContent = document.querySelector('#lwp-modal-content');
    
    modalContent.innerHTML = `
        <!-- Saludo personalizado -->
        <div class="text-center mb-4">
            <h2 class="gamer-subtitle">¡Hola ${user.name}!</h2>
        </div>

        <!-- Display de coins -->
        <div class="coins-display">
            <div class="text-center">
                <img src="/img/coin-flip-59.gif" alt="Coins" width="60" height="50" class="mb-3">
                <div class="coins-amount">${user.points}</div>
                <div style="font-family: 'Pixelify Sans', sans-serif; color: #FF1493; font-size: 1.1rem;">
                    COINS
                </div>
                <p style="color: #FFD700; font-family: 'Roboto', sans-serif; margin-top: 10px;">
                    ¡Sigue jugando para ganar más!
                </p>
            </div>
        </div>

        <!-- Sección de descuentos para usuarios -->
        <div class="discounts-section">
            <div class="text-center">
                <div class="discount-image">
                    🎮
                </div>
                <div class="discount-title">OBTENGA DESCUENTOS</div>
                <div class="discount-count">${Math.floor(user.points / 50)} descuentos disponibles</div>
                <div class="discount-link" onclick="alert('¡Próximamente: Sistema de canje!')">
                    ver más
                </div>
            </div>
        </div>

        <!-- Botones de acción -->
        <div class="text-center mt-4">
            <a href="/ingresar.html" class="gamer-btn" style="font-size: 0.9rem;">
                🏆 Ver Recompensas
            </a>
        </div>
    `;
}

// Función para mostrar loading
function showLoading(){
    const modalContent = document.querySelector('#lwp-modal-content');
    
    modalContent.innerHTML = `
        <div class="text-center" style="padding: 40px 0;">
            <div class="loading-spinner"></div>
            <div class="gamer-subtitle" style="margin-top: 20px;">
                Cargando tu perfil gamer...
            </div>
        </div>
    `;
}

// Función principal para cargar contenido
async function loadUserPoints(){
    const token = getAuthToken();
    const modalContent = document.querySelector('#lwp-modal-content');
    
    if(!modalContent) {
        console.error('Elementos del modal no encontrados');
        return;
    }
    
    if(!token) {
        showGuestView();
        return;
    }
    
    // Mostrar loading
    showLoading();
    
    try {
        const me = await fetchMe(token);
        if(me && typeof me.points !== 'undefined'){
            showUserView(me);
        } else {
            modalContent.innerHTML = `
                <div class="text-center" style="padding: 20px;">
                    <div class="gamer-subtitle" style="color: #FF1493;">
                        Error al cargar datos
                    </div>
                    <p style="color: #FFD700;">No se pudo obtener tu información. Inténtalo de nuevo.</p>
                    <a href="/ingresar.html" class="gamer-btn">
                        Reintentar
                    </a>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error al cargar puntos:', error);
        modalContent.innerHTML = `
            <div class="text-center" style="padding: 20px;">
                <div class="gamer-subtitle" style="color: #FF1493;">
                    Error de conexión
                </div>
                <p style="color: #FFD700;">Verifica tu conexión e inténtalo de nuevo.</p>
                <a href="/ingresar.html" class="gamer-btn">
                    Reintentar
                </a>
            </div>
        `;
    }
}

async function fetchMe(token){
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                if(token){
                    const userStr = localStorage.getItem('user');
                    if(userStr) {
                        const user = JSON.parse(userStr);
                        resolve({
                            id: user.id || 1,
                            name: user.name || 'Gamer',
                            points: user.points || 0
                        });
                    } else {
                        // Usuario demo para presentación
                        resolve({
                            id: 1,
                            name: 'Pro Gamer',
                            points: 350
                        });
                    }
                } else {
                    resolve(null);
                }
            } catch (error) {
                reject(error);
            }
        }, 1500); // Simular carga de red
    });
}

// Función de inicialización
function init(){
    // Verificar que Bootstrap esté disponible
    if(typeof window.bootstrap === 'undefined') {
        console.warn('Bootstrap no está disponible. Usando fallback manual.');
        // Fallback: agregar event listener manual
        document.addEventListener('click', function(e) {
            if(e.target.closest('.loyalty-float-btn')) {
                e.preventDefault();
                toggleOffcanvas();
            }
        });
    }
    
    createWidget();
    
    // Esperar un poco para asegurar que el DOM esté listo
    setTimeout(() => {
        setupEventListeners();
    }, 100);
}

// Configurar event listeners
function setupEventListeners(){
    const loyaltyOffcanvas = document.getElementById('loyaltyOffcanvas');
    
    if (loyaltyOffcanvas) {
        // Event listener para cuando se muestra el offcanvas
        loyaltyOffcanvas.addEventListener('shown.bs.offcanvas', loadUserPoints);
        
        // Event listener para cuando se oculta
        loyaltyOffcanvas.addEventListener('hidden.bs.offcanvas', function() {
            console.log('Widget cerrado');
        });
    }
    
    // Escuchamos cambios de autenticación
    window.addEventListener('storage', (e) => {
        if(e.key === 'authToken' || e.key === 'user'){
            const offcanvas = document.getElementById('loyaltyOffcanvas');
            if(offcanvas && offcanvas.classList.contains('show')) {
                loadUserPoints();
            }
        }
    });
    
    // Event listener personalizado para login
    window.addEventListener('auth:login', () => {
        const offcanvas = document.getElementById('loyaltyOffcanvas');
        if(offcanvas && offcanvas.classList.contains('show')) {
            loadUserPoints();
        }
    });
}

// Fallback para abrir offcanvas manualmente
function toggleOffcanvas(){
    const offcanvas = document.getElementById('loyaltyOffcanvas');
    if(!offcanvas) return;
    
    if(typeof window.bootstrap !== 'undefined') {
        const bsOffcanvas = window.bootstrap.Offcanvas.getOrCreateInstance(offcanvas);
        bsOffcanvas.toggle();
    } else {
        // Fallback básico
        if(offcanvas.style.display === 'block') {
            offcanvas.style.display = 'none';
        } else {
            offcanvas.style.display = 'block';
            offcanvas.style.transform = 'translateX(0)';
            loadUserPoints();
        }
    }
}

// Arrancar cuando DOM listo
if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

})();