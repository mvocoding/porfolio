// modal.js (or the JS file you're testing)
const { bindStaticText, renderPortfolioProjects, renderLiveProjects, hideLoaderAfterDelay } = require('../app.js');

// Mock the fetch API to avoid hitting the real network
global.fetch = jest.fn();

describe('Web page functionality', () => {
    let modal, btnOpenModal, btnCloseModal, loader, wrapper;

    beforeEach(() => {
        // Setup DOM structure for testing
        document.body.innerHTML = `
            <div id="resumeModal" class="modal">
                <button id="btnCloseModal">Close</button>
            </div>
            <button id="btnOpenModal">Open Modal</button>
            <div id="loader" class="loader"></div>
            <div id="project-wrapper"></div>
            <template id="projectItemTpl">
                <div class="project-item">
                    <div data-title></div>
                    <div data-desc></div>
                    <button data-btn></button>
                    <div class="media"></div>
                </div>
            </template>
        `;
        
        modal = document.getElementById('resumeModal');
        btnOpenModal = document.getElementById('btnOpenModal');
        btnCloseModal = document.getElementById('btnCloseModal');
        loader = document.getElementById('loader');
        wrapper = document.getElementById('project-wrapper');
    });

    test('Modal open and close functionality', () => {
        // Check modal opens
        btnOpenModal.click();
        expect(modal.classList.contains('active')).toBe(true);

        // Check modal closes
        btnCloseModal.click();
        expect(modal.classList.contains('active')).toBe(false);
    });

    test('Static text binding works correctly', () => {
        // Mock the data for static binding
        const DATA = {
            email: 'maxvo.dev@gmail.com',
            linkedin: 'https://www.linkedin.com/in/max-vo/',
            github: 'https://github.com/mvocoding',
            aboutme: 'Test about me content.'
        };

        // Mock data-bind elements
        document.body.innerHTML = `
            <div data-bind="email"></div>
            <div data-bind="linkedin"></div>
            <div data-bind="github"></div>
            <div data-bind="aboutme"></div>
        `;

        // Bind the static text (mimicking the bindStaticText function)
        bindStaticText();

        // Check that the text content has been updated
        const emailEl = document.querySelector('[data-bind="email"]');
        expect(emailEl.textContent).toBe(DATA.email);

        const linkedinEl = document.querySelector('[data-bind="linkedin"]');
        expect(linkedinEl.textContent).toBe(DATA.linkedin);

        const githubEl = document.querySelector('[data-bind="github"]');
        expect(githubEl.textContent).toBe(DATA.github);

        const aboutMeEl = document.querySelector('[data-bind="aboutme"]');
        expect(aboutMeEl.textContent).toBe(DATA.aboutme);
    });

    test('Renders portfolio projects correctly', () => {
        const projectData = [
            {
                id: 'codemax',
                title: 'Coding Made Easy',
                desc: 'A platform for developers.',
                type: 'video',
                src: 'assets/codemax.mp4',
                btnText: 'Explore Codemax',
                btnLink: 'https://codemax.dev/'
            }
        ];

        // Mock portfolio data and render
        global.DATA = { projects: projectData };
        renderPortfolioProjects();

        // Check that the project item was added to the DOM
        const projectItem = wrapper.querySelector('.project-item');
        expect(projectItem).not.toBeNull();

        const title = projectItem.querySelector('[data-title]');
        expect(title.textContent).toBe('Coding Made Easy');

        const desc = projectItem.querySelector('[data-desc]');
        expect(desc.textContent).toBe('A platform for developers.');

        const button = projectItem.querySelector('[data-btn]');
        expect(button.textContent).toBe('Explore Codemax');
        expect(button.onclick).toBeInstanceOf(Function);
    });

    test('Fetches and renders live projects', async () => {
        // Mock fetch response
        global.fetch.mockResolvedValueOnce({
            json: jest.fn().mockResolvedValue({
                0: {
                    result: {
                        data: {
                            json: {
                                modes_submission: [
                                    {
                                        href: '/project/1',
                                        id: '1',
                                        title: 'Test Project',
                                        img_url: 'test.jpg',
                                        mode: { id: '1' }
                                    }
                                ]
                            }
                        }
                    }
                }
            })
        });

        // Call renderLiveProjects (it should fetch and render the data)
        await renderLiveProjects();

        // Check if the project has been added to the DOM
        const liveProjectWrapper = document.querySelector('.liveproject-wrapper');
        expect(liveProjectWrapper).toBeTruthy();
        expect(liveProjectWrapper.querySelector('.liveproject-item')).not.toBeNull();
    });

    test('Hides loader after delay', () => {
        // Simulate loading
        hideLoaderAfterDelay();

        // Check if loader is hidden after the delay
        setTimeout(() => {
            expect(loader.classList.contains('hidden')).toBe(true);
        }, 3000);
    });
});
