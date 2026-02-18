/**
 * Sistema de Traducción Universal para Páginas de Proyecto
 * Este archivo se carga en cada proyecto y maneja las traducciones
 */

const projectTranslations = {
    es: {
        // Navegación común
        nav: {
            backHome: 'Regresar al Inicio',
            intro: 'Introducción',
            resources: 'Recursos y Repositorios',
            tools: 'Herramientas Utilizadas',
            code: 'Código',
            repository: 'Repositorio',
            viewOnGithub: 'Ver en GitHub'
        },
        // Footer
        footer: {
            rights: 'Todos los derechos reservados',
            designedBy: 'Diseñado por'
        },
        // Secciones comunes
        sections: {
            introduction: 'Introducción',
            description: 'Descripción',
            features: 'Características',
            technologies: 'Tecnologías',
            implementation: 'Implementación',
            results: 'Resultados',
            conclusion: 'Conclusión'
        },
        // Categorías de proyectos
        categories: {
            automation: 'AUTOMATIZACIÓN DE PROCESOS',
            dataAnalysis: 'ANÁLISIS DE DATOS',
            webDevelopment: 'DESARROLLO WEB',
            businessIntelligence: 'BUSINESS INTELLIGENCE',
            processAutomation: 'Automatización de procesos'
        },
        // Acciones
        actions: {
            viewMore: 'Ver más',
            download: 'Descargar',
            demo: 'Ver Demo',
            documentation: 'Documentación'
        }
    },
    en: {
        // Common Navigation
        nav: {
            backHome: 'Back to Home',
            intro: 'Introduction',
            resources: 'Resources and Repositories',
            tools: 'Tools Used',
            code: 'Code',
            repository: 'Repository',
            viewOnGithub: 'View on GitHub'
        },
        // Footer
        footer: {
            rights: 'All rights reserved',
            designedBy: 'Designed by'
        },
        // Common sections
        sections: {
            introduction: 'Introduction',
            description: 'Description',
            features: 'Features',
            technologies: 'Technologies',
            implementation: 'Implementation',
            results: 'Results',
            conclusion: 'Conclusion'
        },
        // Project categories
        categories: {
            automation: 'PROCESS AUTOMATION',
            dataAnalysis: 'DATA ANALYSIS',
            webDevelopment: 'WEB DEVELOPMENT',
            businessIntelligence: 'BUSINESS INTELLIGENCE',
            processAutomation: 'Process Automation'
        },
        // Actions
        actions: {
            viewMore: 'View more',
            download: 'Download',
            demo: 'View Demo',
            documentation: 'Documentation'
        }
    }
};

class ProjectI18n {
    constructor() {
        this.currentLang = this.detectLanguage();
        this.init();
    }

    detectLanguage() {
        // Verificar localStorage primero
        const savedLang = localStorage.getItem('preferredLanguage');
        if (savedLang && (savedLang === 'es' || savedLang === 'en')) {
            return savedLang;
        }

        // Detectar del navegador
        const browserLang = navigator.language || navigator.userLanguage;
        return browserLang.startsWith('es') ? 'es' : 'en';
    }

    init() {
        this.updatePageLanguage();
        this.setupLanguageToggle();
    }

    setLanguage(lang) {
        if (lang !== 'es' && lang !== 'en') return;
        
        this.currentLang = lang;
        localStorage.setItem('preferredLanguage', lang);
        this.updatePageLanguage();
    }

    toggleLanguage() {
        const newLang = this.currentLang === 'es' ? 'en' : 'es';
        this.setLanguage(newLang);
    }

    translate(key) {
        const keys = key.split('.');
        let value = projectTranslations[this.currentLang];
        
        for (const k of keys) {
            value = value?.[k];
        }
        
        return value || key;
    }

    updatePageLanguage() {
        // Actualizar el atributo lang del HTML
        document.documentElement.lang = this.currentLang;

        // Actualizar elementos con data-i18n
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.translate(key);
            
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = translation;
            } else {
                element.textContent = translation;
            }
        });

        // Actualizar elementos con data-es y data-en
        document.querySelectorAll('[data-es][data-en]').forEach(element => {
            const content = this.currentLang === 'es' 
                ? element.getAttribute('data-es') 
                : element.getAttribute('data-en');
            
            // Preservar HTML interno si existe (como <strong>, <br>, etc)
            if (element.querySelector('*')) {
                // Tiene elementos hijos, no cambiar
                console.warn('Element has children, skipping translation:', element);
            } else {
                // Actualizar el texto
                element.textContent = content;
            }
        });

        // Actualizar elementos con data-title-es y data-title-en (para atributos)
        document.querySelectorAll('[data-title-es][data-title-en]').forEach(element => {
            const title = this.currentLang === 'es' 
                ? element.getAttribute('data-title-es') 
                : element.getAttribute('data-title-en');
            element.setAttribute('title', title);
        });

        // Actualizar elementos con data-placeholder-es y data-placeholder-en
        document.querySelectorAll('[data-placeholder-es][data-placeholder-en]').forEach(element => {
            const placeholder = this.currentLang === 'es' 
                ? element.getAttribute('data-placeholder-es') 
                : element.getAttribute('data-placeholder-en');
            element.setAttribute('placeholder', placeholder);
        });

        // Actualizar el toggle
        this.updateLanguageToggle();
        
        console.log(`✅ Language updated to: ${this.currentLang.toUpperCase()}`);
    }

    setupLanguageToggle() {
        const toggle = document.querySelector('.language-toggle');
        if (toggle) {
            toggle.addEventListener('click', () => this.toggleLanguage());
        }
    }

    updateLanguageToggle() {
        const toggle = document.querySelector('.language-toggle');
        if (toggle) {
            const langText = toggle.querySelector('.lang-text');
            if (langText) {
                langText.textContent = this.currentLang.toUpperCase();
            }
            toggle.setAttribute('aria-label', 
                this.currentLang === 'es' ? 'Switch to English' : 'Cambiar a Español'
            );
        }
    }

    getCurrentLanguage() {
        return this.currentLang;
    }
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.projectI18n = new ProjectI18n();
    });
} else {
    window.projectI18n = new ProjectI18n();
}
