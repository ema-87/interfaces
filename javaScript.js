// Loading Screen Script
document.addEventListener('DOMContentLoaded', function() {
    const pantallaCarga = document.getElementById('pantalla-carga');
    const progresoCarga = document.getElementById('relleno-progreso');
    const porcentajeProgreso = document.getElementById('porcentaje-progreso');
    
    if (!pantallaCarga || !progresoCarga || !porcentajeProgreso) {
        console.error('Elementos de carga no encontrados');
        return;
    }

    const mainContent = document.querySelector('.main-content');
    const header = document.querySelector('.header');
    const footer = document.querySelector('.footer');
    const sidebar = document.querySelector('.nav-bar');

    // ocultar contenido
    if (mainContent) mainContent.style.display = 'none';
    if (header) header.style.display = 'none';
    if (footer) footer.style.display = 'none';
    if (sidebar) sidebar.style.display = 'none';
    
    let progresion = 0;
    const duracion = 5000; //segundos
    const intervalo = 50; // actualizar cada ms
    const incrementacion = (100 / (duracion / intervalo));
    
    const progresionIntervalo = setInterval(() => {
        progresion += incrementacion;
        
        if (progresion >= 100) {
            progresion = 100;
            clearInterval(progresionIntervalo);
            
            // esperar antes de ocultar
            setTimeout(() => {
                pantallaCarga.style.opacity = '0';
                pantallaCarga.style.transition = 'opacity 0.5s ease';
                
                setTimeout(() => {
                    pantallaCarga.style.display = 'none';
                    mainContent.style.display = 'block';
                    header.style.display = 'flex';
                    footer.style.display = 'block';
                    sidebar.style.display = 'block';
                    
                    // inicializar carrusel después de mostrar el contenido
                    initCarousel();
                    
                    // inicializar menú hamburguesa
                    initHamburgerMenu();
                }, 500);
            }, 200);
        }
        
        // actualizar barra de progreso
        progresoCarga.style.width = progresion + '%';
        porcentajeProgreso.textContent = Math.floor(progresion) + '%';
    }, intervalo);
    
    /*
    // MODO DESARROLLO
    const pantallaCarga = document.getElementById('pantalla-carga');
    const mainContent = document.querySelector('.main-content');
    const header = document.querySelector('.header');
    const footer = document.querySelector('.footer');
    const sidebar = document.querySelector('.nav-bar');
    
    // Ocultar pantalla de carga inmediatamente
    if (pantallaCarga) pantallaCarga.style.display = 'none';
    
    // Mostrar todo el contenido inmediatamente
    if (mainContent) mainContent.style.display = 'block';
    if (header) header.style.display = 'flex';
    if (footer) footer.style.display = 'block';
    if (sidebar) sidebar.style.display = 'block';
    */  
    // Funcionalidad de carrusel
    initCarousel();
    
    // Inicializar menú hamburguesa
    initHamburgerMenu();
    
    // Inicializar sidebar móvil
    initMobileSidebar();
    
});

// Función para iniciar carrusel
function initCarousel() {
    const sections = document.querySelectorAll('.section');
    
    sections.forEach((section, index) => {
        const gamesGrid = section.querySelector('.games-grid');
        const scrollRightBtn = section.querySelector('.scroll-derecha');
        const scrollLeftBtn = section.querySelector('.scroll-izquierda');
        
        if (!gamesGrid || !scrollRightBtn) {
            return;
        }
        
        // Función para calcular si debe haber overflow basado en el contenido
        function shouldHaveOverflow() {
            const totalCards = gamesGrid.children.length;
            const containerWidth = gamesGrid.clientWidth;
            const firstCard = gamesGrid.querySelector('.game-card, .game-card-horizontal');
            
            if (!firstCard) return totalCards > 3; // Fallback básico
            
            const cardWidth = firstCard.offsetWidth;
            const gap = 20;
            const totalContentWidth = (cardWidth + gap) * totalCards - gap;
            
            // Múltiples criterios para detectar overflow - más inteligente
            const shouldOverflowByContent = totalContentWidth > containerWidth;
            const shouldOverflowByCount = totalCards > 4; // Ahora más conservador para pantallas grandes
            const shouldOverflowByWidth = containerWidth < 1000; // Ajustado para el nuevo max-width
            
            // Para la primera sección (7 cards verticales), siempre debe haber overflow
            const isFirstSection = gamesGrid.querySelector('.game-card') !== null;
            const shouldOverflowFirstSection = isFirstSection && totalCards >= 7;
            
            // Para secciones horizontales con más de 4 cards
            const isHorizontalSection = gamesGrid.querySelector('.game-card-horizontal') !== null;
            const shouldOverflowHorizontalSection = isHorizontalSection && totalCards > 4;
            
            const finalDecision = shouldOverflowByContent || shouldOverflowByCount || shouldOverflowByWidth || 
                                shouldOverflowFirstSection || shouldOverflowHorizontalSection;
            
            return finalDecision;
        }
        
        // Función para actualizar la visibilidad de las flechas
        function updateArrows() {
            const scrollWidth = gamesGrid.scrollWidth;
            const clientWidth = gamesGrid.clientWidth;
            const scrollLeft = gamesGrid.scrollLeft;
            const maxScroll = Math.max(0, scrollWidth - clientWidth);
            
            // Usar múltiples métodos para detectar overflow
            const hasOverflowBySize = scrollWidth > clientWidth;
            const hasOverflowByCalc = shouldHaveOverflow();
            const hasOverflow = hasOverflowBySize || hasOverflowByCalc;
            
            // Mostrar/ocultar flecha izquierda
            if (scrollLeftBtn) {
                const showLeft = hasOverflow && scrollLeft > 1;
                scrollLeftBtn.style.display = showLeft ? 'flex' : 'none';
                scrollLeftBtn.style.opacity = showLeft ? '1' : '0';
                scrollLeftBtn.style.visibility = showLeft ? 'visible' : 'hidden';
            }
            
            // Mostrar/ocultar flecha derecha
            if (scrollRightBtn) {
                const showRight = hasOverflow && (maxScroll === 0 || scrollLeft < maxScroll - 1);
                scrollRightBtn.style.display = showRight ? 'flex' : 'none';
                scrollRightBtn.style.opacity = showRight ? '1' : '0';
                scrollRightBtn.style.visibility = showRight ? 'visible' : 'hidden';
            }
        }
        
        // Calcular scroll amount dinámicamente
        function getScrollAmount() {
            const firstCard = gamesGrid.querySelector('.game-card, .game-card-horizontal');
            if (!firstCard) return 200;
            
            const cardWidth = firstCard.offsetWidth;
            const gap = 20;
            return cardWidth + gap;
        }
        
        // Scroll hacia la derecha
        scrollRightBtn.addEventListener('click', () => {
            const scrollAmount = getScrollAmount();
            
            // Agregar animación de achique a las cards
            addScrollAnimation(gamesGrid);
            
            gamesGrid.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
            
            setTimeout(updateArrows, 300);
        });
        
        // Scroll hacia la izquierda
        if (scrollLeftBtn) {
            scrollLeftBtn.addEventListener('click', () => {
                const scrollAmount = getScrollAmount();
                
                // Agregar animación de achique a las cards
                addScrollAnimation(gamesGrid);
                
                gamesGrid.scrollBy({
                    left: -scrollAmount,
                    behavior: 'smooth'
                });
                
                setTimeout(updateArrows, 300);
            });
        }
        
        // Inicializar después de que todo se haya cargado
        function initializeSection() {
            updateArrows();
        }
        
        // Esperar a que las imágenes se carguen
        const images = gamesGrid.querySelectorAll('img');
        let loadedImages = 0;
        
        if (images.length === 0) {
            // Si no hay imágenes, inicializar inmediatamente
            setTimeout(initializeSection, 100);
        } else {
            images.forEach(img => {
                if (img.complete) {
                    loadedImages++;
                } else {
                    img.addEventListener('load', () => {
                        loadedImages++;
                        if (loadedImages === images.length) {
                            setTimeout(initializeSection, 100);
                        }
                    });
                    img.addEventListener('error', () => {
                        loadedImages++;
                        if (loadedImages === images.length) {
                            setTimeout(initializeSection, 100);
                        }
                    });
                }
            });
            
            // Si todas las imágenes ya están cargadas
            if (loadedImages === images.length) {
                setTimeout(initializeSection, 100);
            }
            
            // Fallback en caso de que algo falle
            setTimeout(initializeSection, 1500);
        }
        
        // Actualizar flechas cuando cambie el scroll
        gamesGrid.addEventListener('scroll', updateArrows);
        
        // Actualizar flechas cuando cambie el tamaño de la ventana
        window.addEventListener('resize', () => {
            setTimeout(updateArrows, 200);
        });
    });
}


// Función para agregar animación de achique durante el scroll
function addScrollAnimation(gamesGrid) {
    const cards = gamesGrid.querySelectorAll('.game-card, .game-card-horizontal');
    
    // Agregar clase de animación a todas las cards
    cards.forEach(card => {
        card.classList.add('scrolling-animation');
    });
    
    // Remover la clase después de que termine el scroll (tiempo del smooth scroll)
    setTimeout(() => {
        cards.forEach(card => {
            card.classList.remove('scrolling-animation');
        });
    }, 250); // 250ms es aproximadamente el tiempo del smooth scroll
}

// Función para inicializar el menú hamburguesa
function initHamburgerMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const menuDropdown = document.getElementById('menu-dropdown');
    const menuClose = document.getElementById('menu-close');
    const menuOverlay = document.getElementById('menu-overlay');
    
    function closeMenu() {
        menuDropdown.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Abrir menú
    menuToggle?.addEventListener('click', () => {
        menuDropdown.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    // Cerrar menú
    menuClose?.addEventListener('click', closeMenu);
    menuOverlay?.addEventListener('click', closeMenu);
    
    // Cerrar con Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeMenu();
    });
    
    // Cerrar al hacer click en cualquier opción
    document.querySelectorAll('.menu-option').forEach(option => {
        option.addEventListener('click', closeMenu);
    });
}

// Función para manejar el sidebar en móvil
function initMobileSidebar() {
    const navToggle = document.getElementById('nav-toggle');
    const navBar = document.getElementById('nav-bar');
    const navOverlay = document.getElementById('nav-overlay');
    
    function closeSidebar() {
        navBar.classList.remove('active');
        navOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    function openSidebar() {
        navBar.classList.add('active');
        navOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    // Mostrar/ocultar botón según el tamaño de pantalla
    function toggleNavButton() {
        if (window.innerWidth <= 768) {
            navToggle.style.display = 'block';
        } else {
            navToggle.style.display = 'none';
            closeSidebar();
        }
    }
    
    // Eventos
    navToggle?.addEventListener('click', openSidebar);
    navOverlay?.addEventListener('click', closeSidebar);
    
    // Cerrar sidebar al hacer click en un elemento del nav
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', closeSidebar);
    });
    
    // Cerrar con Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeSidebar();
    });
    
    // Inicializar y escuchar cambios de tamaño
    toggleNavButton();
    window.addEventListener('resize', toggleNavButton);
}

// Función para mostrar animación de éxito
function showSuccessAnimation() {
    // Crear overlay de éxito
    const successOverlay = document.createElement('div');
    successOverlay.innerHTML = `
        <div class="success-container">
            <div class="success-icon">
                <i class="fas fa-check"></i>
            </div>
            <h2>¡Éxito!</h2>
            <p>Redirigiendo...</p>
        </div>
    `;
    successOverlay.className = 'success-overlay';
    document.body.appendChild(successOverlay);
    
    // Forzar reflow para que la animación funcione
    successOverlay.offsetHeight;
    successOverlay.classList.add('show');
}

 //Login Register
  



    document.addEventListener('DOMContentLoaded', function() {
    // Mostrar/ocultar contraseña
    document.querySelectorAll('.register-toggle-password').forEach(icon => {
        icon.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            if (input.type === "password") {
                input.type = "text";
                this.innerHTML = '<i class="fas fa-eye-slash"></i>';
            } else {
                input.type = "password";
                this.innerHTML = '<i class="fas fa-eye"></i>';
            }
        });
    });

    // Generar código captcha aleatorio de 5 caracteres (letras o números)
    function generarCaptcha() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let code = '';
        for (let i = 0; i < 5; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    }

    const captchaCodeDiv = document.getElementById('codigo-captcha');
    let captchaValue = '';
    if (captchaCodeDiv) {
        captchaValue = generarCaptcha();
        captchaCodeDiv.textContent = captchaValue;
    }

    // Validar captcha al enviar el formulario de registro
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevenir el envío por defecto
            
            // PASO 1: Verificar que las contraseñas coincidan
            const password1 = document.getElementById('password');
            const password2 = document.getElementById('password2');
            
            if (password1.value !== password2.value) {
                password2.value = '';
                password2.focus();
                password2.placeholder = 'Las contraseñas no coinciden!';
                return; // Detener aquí si las contraseñas no coinciden
            }
            
            // PASO 2: Si las contraseñas coinciden, validar el captcha
            const captchaInput = document.getElementById('captcha-input');
            
            if (captchaInput && captchaInput.value.trim() !== captchaValue) {
                captchaInput.value = '';
                captchaInput.focus();
                captchaInput.placeholder = 'Código incorrecto!';
                captchaValue = generarCaptcha();
                captchaCodeDiv.textContent = captchaValue;
            } else {
                // Si todo es correcto, mostrar animación de éxito
                const submitBtn = registerForm.querySelector('.register-submit-btn');
                submitBtn.textContent = 'Procesando...';
                submitBtn.classList.add('success');
            
                setTimeout(() => {
                    submitBtn.textContent = 'Exitoso!';
                }, 700);
            
                setTimeout(() => {
                    window.location.href = 'Home.html';
                }, 1200);
            }
        });
    }

    // Manejar formulario de login
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevenir el envío por defecto
            
            const emailPhone = document.getElementById('email-telefono');
            const password = document.getElementById('password');
            
        
            // Mostrar animación de éxito y luego redirigir
            const submitBtn = loginForm.querySelector('.register-submit-btn');
            submitBtn.textContent = 'Procesando...';
            submitBtn.classList.add('success');
            
            setTimeout(() => {
                submitBtn.textContent = 'Exitoso!';
            }, 700);
            
            setTimeout(() => {
                window.location.href = 'Home.html';
            }, 1200);
        });
    }
});

// ===== JUEGO BLOCKA =====

class BlockaGame {
    constructor() {
        this.currentLevel = 1;
        this.maxLevel = 6;
        this.timer = 0;
        this.timerInterval = null;
        this.isGameActive = false;

        this.gameImages = [
            '../img/fifa24.jpeg',
            '../img/cs2.jpg',
            '../img/black%20ops3.jpeg',
            '../img/Uncharted_4_portada.webp',
            '../img/fifa23.jpeg',
            '../img/fifa22.jpeg'
        ];
        this.currentImage = '';
        this.puzzle = [];
        this.correctPositions = [];
        this.fixedPieces = new Set();
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.showStartScreen();
    }

    bindEvents() {
        // Botones principales
        const startBtn = document.getElementById('start-btn');
        const restartBtn = document.getElementById('restart-btn');
        const menuBtn = document.getElementById('menu-btn');
        const nextLevelBtn = document.getElementById('next-level-btn');
        
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                console.log('Botón comenzar clickeado');
                this.startGame();
            });
        }
        
        if (restartBtn) {
            restartBtn.addEventListener('click', () => this.restartLevel());
        }
        
        if (menuBtn) {
            menuBtn.addEventListener('click', () => {
                console.log('Botón menú clickeado');
                this.goToMenu();
            });
        }
        
        if (nextLevelBtn) {
            nextLevelBtn.addEventListener('click', () => {
                console.log('Botón siguiente nivel clickeado');
                this.nextLevel();
            });
        }
        

        
        // Imagen de referencia
        const showReferenceCheckbox = document.getElementById('show-reference');
        if (showReferenceCheckbox) {
            showReferenceCheckbox.addEventListener('change', (e) => {
                const referenceImg = document.getElementById('reference-image');
                if (referenceImg) {
                    referenceImg.style.display = e.target.checked ? 'block' : 'none';
                }
            });
        }
    }

    showStartScreen() {
        console.log('Mostrando pantalla de inicio');
        this.hideAllScreens();
        
        const startScreen = document.getElementById('start-screen');
        const currentLevelSpan = document.getElementById('current-level');
        const startBtn = document.getElementById('start-btn');
        const restartBtn = document.getElementById('restart-btn');
        
        if (startScreen) startScreen.style.display = 'block';
        if (currentLevelSpan) currentLevelSpan.textContent = this.currentLevel;
        
        // Resetear botones
        if (startBtn) startBtn.style.display = 'flex';
        if (restartBtn) restartBtn.style.display = 'none';
    }

    async startGame() {
        console.log('Iniciando juego...');
        this.isGameActive = true;
        this.timer = 0;
        
        // Mostrar botones del juego
        const startBtn = document.getElementById('start-btn');
        const restartBtn = document.getElementById('restart-btn');
        
        if (startBtn) startBtn.style.display = 'none';
        if (restartBtn) restartBtn.style.display = 'flex';
        
        // Seleccionar imagen aleatoria
        await this.selectRandomImage();
        
        // Crear puzzle
        this.createPuzzle();
        
        // Mostrar tablero
        this.showGameBoard();
        
        // Iniciar temporizador
        this.startTimer();
    }

    async selectRandomImage() {
        // Seleccionar imagen aleatoria directamente
        const randomIndex = Math.floor(Math.random() * this.gameImages.length);
        this.currentImage = this.gameImages[randomIndex];
        
        // Configurar imagen de referencia
        document.getElementById('reference-img').src = this.currentImage;
        
        return Promise.resolve();
    }

    createPuzzle() {
        this.puzzle = [];
        this.correctPositions = [];
        
        const totalPieces = 4; // Siempre 2x2
        const cols = 2;
        const rows = 2;
        
        // Crear piezas
        for (let i = 0; i < totalPieces; i++) {
            const piece = {
                id: i,
                currentRotation: 0,
                correctRotation: 0, // La rotación correcta es siempre 0 (imagen original)
                backgroundPosition: this.calculateBackgroundPosition(i, cols, rows)
            };
            
            // Rotar aleatoriamente (0, 90, 180, 270 grados)
            piece.currentRotation = Math.floor(Math.random() * 4) * 90;
            
            this.puzzle.push(piece);
            this.correctPositions.push(0); // Todas las piezas deben estar en rotación 0 para formar la imagen original
        }
        
        this.updateProgress();
    }

    calculateBackgroundPosition(index, cols, rows) {
        const col = index % cols;
        const row = Math.floor(index / cols);
        const percentX = (col / (cols - 1)) * 100;
        const percentY = (row / (rows - 1)) * 100;
        return `${percentX}% ${percentY}%`;
    }

    showGameBoard() {
        this.hideAllScreens();
        document.getElementById('game-board').style.display = 'block';
        
        const puzzleGrid = document.getElementById('puzzle-grid');
        const totalPieces = 4; // Siempre 2x2 (4 piezas)
        
        // Configurar grid para 2x2
        puzzleGrid.className = 'puzzle-grid grid-2x2';
        puzzleGrid.innerHTML = '';
        
        // Crear elementos de las piezas
        this.puzzle.forEach((piece, index) => {
            const pieceElement = document.createElement('div');
            pieceElement.className = 'puzzle-piece';
            pieceElement.dataset.pieceId = piece.id;
            
            // Configurar imagen de fondo
            pieceElement.style.backgroundImage = `url(${this.currentImage})`;
            pieceElement.style.backgroundPosition = piece.backgroundPosition;
            pieceElement.style.backgroundSize = '200% 200%'; // 2x2 = 200% en cada dirección
            
            // Aplicar rotación inicial
            pieceElement.style.transform = `rotate(${piece.currentRotation}deg)`;
            
            // Aplicar filtro según el nivel
            this.applyLevelFilter(pieceElement);
            
            // Eventos de click
            pieceElement.addEventListener('click', (e) => this.rotatePiece(e, piece.id, -90));
            pieceElement.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                this.rotatePiece(e, piece.id, 90);
            });
            
            puzzleGrid.appendChild(pieceElement);
        });
        
        // Actualizar contador de piezas
        document.getElementById('total-pieces').textContent = totalPieces;
    }

    applyLevelFilter(element) {
        // Remover todos los filtros
        element.classList.remove('filter-grayscale', 'filter-brightness', 'filter-negative', 'filter-sepia', 'filter-blur');
        
        // Aplicar filtro según el nivel
        switch (this.currentLevel) {
            case 1:
                element.classList.add('filter-grayscale');
                break;
            case 2:
                element.classList.add('filter-brightness');
                break;
            case 3:
                element.classList.add('filter-negative');
                break;
            case 4:
                element.classList.add('filter-sepia');
                break;
            case 5:
                element.classList.add('filter-blur');
                break;
            case 6:
                // Combinar filtros para máxima dificultad
                element.classList.add('filter-grayscale', 'filter-brightness');
                break;
        }
    }

    rotatePiece(event, pieceId, degrees) {
        if (!this.isGameActive || this.fixedPieces.has(pieceId)) {
            return;
        }
        
        const piece = this.puzzle[pieceId];
        const pieceElement = event.target;
        
        // Actualizar rotación
        piece.currentRotation = (piece.currentRotation + degrees + 360) % 360;
        
        // Aplicar rotación visual
        pieceElement.style.transform = `rotate(${piece.currentRotation}deg)`;
        
        // Verificar si está correcta
        const isCorrect = piece.currentRotation === piece.correctRotation;
        
        if (isCorrect) {
            pieceElement.classList.add('correct');
            // Quitar filtros cuando está correcta
            pieceElement.classList.remove('filter-grayscale', 'filter-brightness', 'filter-negative', 'filter-sepia', 'filter-blur');
        } else {
            pieceElement.classList.remove('correct');
            // Reaplicar filtros
            this.applyLevelFilter(pieceElement);
        }
        
        this.updateProgress();
        this.checkWinCondition();
    }



    updateProgress() {
        const correctPieces = this.puzzle.filter(piece => piece.currentRotation === piece.correctRotation).length;
        const totalPieces = this.puzzle.length;
        const percentage = (correctPieces / totalPieces) * 100;
        
        document.getElementById('progress-fill').style.width = `${percentage}%`;
        document.getElementById('progress-pieces').textContent = correctPieces;
    }

    checkWinCondition() {
        const allCorrect = this.puzzle.every(piece => piece.currentRotation === piece.correctRotation);
        
        if (allCorrect) {
            this.winLevel();
        }
    }

    winLevel() {
        this.isGameActive = false;
        this.stopTimer();
        
        // Mostrar pantalla de éxito
        setTimeout(() => {
            this.showSuccessScreen();
        }, 1000);
    }

    showSuccessScreen() {
        this.hideAllScreens();
        document.getElementById('success-screen').style.display = 'block';
        
        // Mostrar estadísticas
        document.getElementById('final-time').textContent = this.formatTime(this.timer);
        document.getElementById('final-level').textContent = this.currentLevel;
        
        // Configurar botones
        const nextLevelBtn = document.getElementById('next-level-btn');
        if (this.currentLevel >= this.maxLevel) {
            nextLevelBtn.textContent = '🎉 Juego Completado';
            nextLevelBtn.disabled = true;
        } else {
            nextLevelBtn.disabled = false;
            nextLevelBtn.innerHTML = '<i class="fas fa-arrow-right"></i> Siguiente Nivel';
        }
    }

    nextLevel() {
        console.log(`Siguiente nivel: ${this.currentLevel} -> ${this.currentLevel + 1}`);
        if (this.currentLevel < this.maxLevel) {
            this.currentLevel++;
            // Iniciar directamente el siguiente nivel sin pantalla de bienvenida
            this.startGame();
        } else {
            // Si es el último nivel, volver al menú
            console.log('Último nivel completado, volviendo al menú');
            this.goToMenu();
        }
    }

    restartLevel() {
        this.stopTimer();
        this.isGameActive = false;
        this.startGame();
    }

    goToMenu() {
        this.stopTimer();
        this.isGameActive = false;
        this.showStartScreen();
    }

    startTimer() {
        this.timerInterval = setInterval(() => {
            this.timer++;
            document.getElementById('timer').textContent = this.formatTime(this.timer);
        }, 1000);
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    hideAllScreens() {
        const screens = [
            'start-screen',
            'image-selection', 
            'game-board',
            'success-screen'
        ];
        
        screens.forEach(screenId => {
            const screen = document.getElementById(screenId);
            if (screen) {
                screen.style.display = 'none';
            }
        });
    }
}

// Inicializar el juego BLOCKA cuando la página cargue
document.addEventListener('DOMContentLoaded', function() {
    // Verificar si estamos en la página del juego
    if (document.querySelector('.blocka-container')) {
        console.log('Inicializando juego BLOCKA...');
        const blockaGame = new BlockaGame();
        
        // Inicializar menú hamburguesa para la página del juego
        initHamburgerMenu();
    }
});