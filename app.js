const $ = (id) => document.getElementById(id);
const $$ = (selector) => document.querySelectorAll(selector);

const DATA = {
    email: 'maxvo.dev@gmail.com',
    linkedin: 'https://www.linkedin.com/in/max-vo/',
    github: 'https://github.com/mvocoding',
    aboutme: `A full stack website developer focusing on creating fancy and elegant websites for all users and customers. I’m an active learner who enjoys exploring new technologies and continuously improving my skills. I believe every project is a new mountain to climb, and I’m always ready for the next challenge on my programming journey`,
    projects: [
        {
            id: 'codemax',
            type: 'video',
            src: 'assets/codemax.mp4',
            logo: 'assets/codemax-h.png',
            title: 'Coding Made Easy',
            desc: `Built CodeMax, a platform that makes coding easier by offering hands-on challenges to help developers improve their skills`,
            btnText: 'Explore Codemax',
            btnLink: 'https://codemax.dev/'
        },
        {
            id: 'starfish',
            type: 'image',
            src: 'assets/starfish-project.png',
            logo: 'assets/starfish-h.png',
            title: 'Transforming Public Safety Reporting',
            desc: `At Starfish, I designed and delivered a mobile-friendly, multi-tenant crime reporting platform supporting anonymous submissions, media uploads, and audit logging—enhancing transparency, accessibility, and performance`,
        },
        {
            id: 'codinggpt',
            type: 'video',
            src: 'assets/codinggpt.mp4',
            logo: 'assets/codinggpt-h.png',
            title: 'Bringing Code to Life',
            desc: `CodingGPT is my TikTok channel where I share short-form videos on CSS animations, front-end effects, and web UI experiments, inspired by real cartoon or anime characters`,
            btnLink: 'https://www.tiktok.com/@codinggpt'
        },
        {
            id: 'dxc',
            type: 'image',
            src: 'assets/dxc-nursing.png',
            logo: 'assets/dxc-h.png',
            title: 'Modernizing Resident Care Systems',
            desc: `At DXC Technology, I contributed to the design of a digital care platform for nursing homes, supporting real-time health monitoring, simplified medication management, and smoother collaboration between nurses and doctors`
        }
    ]
};


// Function to bind static text to elements with a `data-bind` attribute
const bindStaticText = () => {
    $$('[data-bind]').forEach((el) => {
        const key = el.dataset.bind;
        el.textContent = DATA[key] || '';
    });
};

// Function to create a project element
const createProjectElement = (project, index) => {
    const template = document.getElementById('projectItemTpl');
    const clone = template.content.cloneNode(true);
    const rootEl = clone.firstElementChild;
    rootEl.id = project.id;

    if (index === 0) rootEl.classList.add('bg-highlight');

    clone.querySelector('[data-title]').textContent = project.title;
    clone.querySelector('[data-desc]').textContent = project.desc;

    const btn = clone.querySelector('[data-btn]');
    if (project.btnText && project.btnLink) {
        btn.textContent = project.btnText;
        btn.addEventListener('click', () => window.open(project.btnLink, '_blank'));
    } else {
        btn.classList.add('!hidden');
    }

    const mediaContainer = clone.querySelector('.media');
    if (project.type === 'video') {
        const video = document.createElement('video');
        Object.assign(video, { src: project.src, autoplay: true, loop: true, muted: true, playsInline: true });
        mediaContainer.appendChild(video);
    } else {
        const img = document.createElement('img');
        img.src = project.src;
        mediaContainer.appendChild(img);
    }

    return rootEl;
};

// Function to render portfolio projects
const renderPortfolioProjects = () => {
    const projectWrapper = document.getElementById('project-wrapper');
    DATA.projects.forEach((project, index) => {
        const projectElement = createProjectElement(project, index);
        projectWrapper.appendChild(projectElement);
    });
};

// Function to hide loader after a delay
const hideLoaderAfterDelay = () => setTimeout(() => {
    const loader = document.getElementById('loader');
    loader?.classList.add('hidden');
}, 3000);

// Function to initialize the script
const initialize = () => {
    bindStaticText();
    renderPortfolioProjects();
    renderLiveProjects();
    hideLoaderAfterDelay();
};

const renderLiveProjects = async () => {
    const container = document.querySelector('.liveproject');
    const wrapperTemplate = document.querySelector('#tplliveproject');
    const wrapper = wrapperTemplate.content.querySelector('.liveproject-wrapper').cloneNode(true);
    const itemTemplate = wrapperTemplate.content.querySelector('.liveproject-item');

    try {
        const response = await fetch('https://mcorsproxy.netlify.app/.netlify/functions/api/live-projects');
        const projects = await response.json();

        projects.forEach((project) => {
            const { href, title, imgSrc } = project;
            const item = itemTemplate.cloneNode(true);
            const titleEl = item.querySelector('.title');
            const imgEl = item.querySelector('.image');
            const btn = item.querySelector('.view-btn');

            titleEl.textContent = title;
            imgEl.src = imgSrc;
            btn.addEventListener('click', () => window.open(`https://icodethis.com${href}`, '_blank'));

            wrapper.appendChild(item);
        });

        container.appendChild(wrapper);
    } catch (error) {
        console.error('Failed to fetch live projects:', error);
    }
};

// Function to open/close modal
const setupModalEvents = () => {
    const resumeModal = document.getElementById('resumeModal');
    const btnOpenModal = document.getElementById('btnOpenModal');
    const btnCloseModal = document.getElementById('btnCloseModal');

    btnOpenModal.addEventListener('click', () => resumeModal.classList.add('active'));
    btnCloseModal.addEventListener('click', () => resumeModal.classList.remove('active'));
};

// Initialization that runs when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    initialize();
    setupModalEvents();
});

// Export for Jest (Node)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        bindStaticText,
        renderPortfolioProjects,
        hideLoaderAfterDelay,

    };
}