/**
 * ADAPTIVE TOOLS GRID - Ajusta automáticamente el grid según cantidad de herramientas
 * Auto-detecta y organiza las herramientas de forma óptima
 */

(function() {
    'use strict';
    
    // Ejecutar cuando el DOM esté listo
    function initAdaptiveToolsGrid() {
        // Buscar la sección de herramientas
        const toolsSection = document.querySelector('.portfolio_end .container');
        
        if (!toolsSection) return;
        
        // Buscar todos los .single-list (herramientas)
        const tools = toolsSection.querySelectorAll('.single-list');
        
        if (tools.length === 0) return;
        
        // Crear contenedor grid si no existe
        let toolsGrid = toolsSection.querySelector('.tools-grid');
        
        if (!toolsGrid) {
            // Crear el grid
            toolsGrid = document.createElement('div');
            toolsGrid.className = 'tools-grid';
            
            // Mover todos los .single-list al grid
            tools.forEach(tool => {
                toolsGrid.appendChild(tool);
            });
            
            // Insertar el grid después del header
            const header = toolsSection.querySelector('.section-header');
            if (header) {
                header.after(toolsGrid);
            } else {
                toolsSection.appendChild(toolsGrid);
            }
        }
        
        // Establecer atributo data-count para el grid adaptativo
        const toolCount = tools.length;
        toolsGrid.setAttribute('data-count', toolCount);
        
        // Agregar animaciones escalonadas
        tools.forEach((tool, index) => {
            tool.style.animationDelay = `${index * 0.1}s`;
            tool.classList.add('wow', 'fadeInUp');
        });
        
        console.log(`✅ Adaptive Tools Grid initialized: ${toolCount} tools`);
    }
    
    // Ejecutar al cargar el DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAdaptiveToolsGrid);
    } else {
        initAdaptiveToolsGrid();
    }
    
    // También ejecutar después de que WOW.js se inicialice
    setTimeout(initAdaptiveToolsGrid, 100);
    
})();


/**
 * IMAGE RATIO DETECTOR - Detecta automáticamente la relación de aspecto de imágenes
 */

(function() {
    'use strict';
    
    function detectImageRatios() {
        const images = document.querySelectorAll('.bar_img img');
        
        images.forEach(img => {
            // Esperar a que la imagen cargue
            if (img.complete) {
                setImageRatio(img);
            } else {
                img.addEventListener('load', function() {
                    setImageRatio(this);
                });
            }
        });
    }
    
    function setImageRatio(img) {
        const container = img.closest('.bar_img');
        if (!container) return;
        
        const width = img.naturalWidth;
        const height = img.naturalHeight;
        const ratio = width / height;
        
        // Determinar clase según ratio
        if (ratio > 1.6) {
            container.classList.add('ratio-16-9');
        } else if (ratio > 1.2) {
            container.classList.add('ratio-4-3');
        } else if (ratio >= 0.9 && ratio <= 1.1) {
            container.classList.add('ratio-1-1');
        }
    }
    
    // Ejecutar
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', detectImageRatios);
    } else {
        detectImageRatios();
    }
    
})();


/**
 * SMOOTH SCROLL - Scroll suave para navegación interna
 */

(function() {
    'use strict';
    
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                
                // Ignorar si es solo #
                if (href === '#') return;
                
                const target = document.querySelector(href);
                
                if (target) {
                    e.preventDefault();
                    
                    const offsetTop = target.offsetTop - 80; // 80px para navbar
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    // Ejecutar
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSmoothScroll);
    } else {
        initSmoothScroll();
    }
    
})();


/**
 * LAZY LOADING MEJORADO - Carga diferida de imágenes
 */

(function() {
    'use strict';
    
    function initLazyLoading() {
        const images = document.querySelectorAll('.bar_img img[data-src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        const src = img.getAttribute('data-src');
                        
                        if (src) {
                            img.src = src;
                            img.removeAttribute('data-src');
                            img.classList.add('loaded');
                        }
                        
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px'
            });
            
            images.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback para navegadores antiguos
            images.forEach(img => {
                const src = img.getAttribute('data-src');
                if (src) {
                    img.src = src;
                    img.removeAttribute('data-src');
                }
            });
        }
    }
    
    // Ejecutar
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initLazyLoading);
    } else {
        initLazyLoading();
    }
    
})();


/**
 * TOOL TIP HELPER - Muestra tooltips en herramientas
 */

(function() {
    'use strict';
    
    function initToolTips() {
        const tools = document.querySelectorAll('.single-list');
        
        tools.forEach(tool => {
            const title = tool.querySelector('.text-p-end h6');
            if (title && title.textContent.length > 20) {
                tool.setAttribute('title', title.textContent);
            }
        });
    }
    
    // Ejecutar
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initToolTips);
    } else {
        initToolTips();
    }
    
})();


/**
 * CONSOLE INFO - Información útil en consola
 */

console.log('%c✨ Project Page Enhanced ', 'background: #985E6D; color: white; padding: 5px 10px; border-radius: 3px; font-weight: bold;');
console.log('%cFeatures:', 'font-weight: bold; font-size: 14px;');
console.log('• Adaptive Tools Grid');
console.log('• Image Ratio Detection');
console.log('• Smooth Scroll');
console.log('• Lazy Loading');
console.log('• Multilanguage Support');
