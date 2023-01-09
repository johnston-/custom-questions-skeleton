import { PREFIX, testSVG, seroAssessment, seroAssessment2 } from './constants';
import { AssessmentManager } from './AssessmentManager';

export default class Question {
    constructor(init, lrnUtils) {
        this.init = init;
        this.events = init.events;
        this.lrnUtils = lrnUtils;
        this.el = init.$el.get(0);
        this.AssessmentManager = new AssessmentManager();
        this.AssessmentManager.setQuestionEvents(this.events);
        this.render().then(() => {
            this.registerPublicMethods();
            this.handleEvents();

            if (init.state === 'review') {
                init.getFacade().disable();
            }

            if (init.state === "resume") {
                let response = init.getFacade().getResponse();
                this.AssessmentManager.renderSavedSKEAssessment(response.value)
            }
            else{
                this.AssessmentManager.renderSKEAssessment(seroAssessment)    
            }
            
            init.events.trigger('ready');
        });
    }

    render() {
        const { el, init, lrnUtils, } = this;
        const { question, response } = init;

        el.innerHTML = `
            <div class="${PREFIX} lrn-response-validation-wrapper">
                <div class="lrn_response_input">
                    <svg data-sero-canvas width="100%" height="742" style="background: black;">
                        <defs><marker id="end-arrow" viewBox="0 -5 10 10" refX="6" markerUnits="userSpaceOnUse" markerWidth="18" markerHeight="18" orient="auto"><path d="M0,-5L10,0L0,5" fill="#778899"></path></marker></defs><defs><marker id="end-large-arrow" viewBox="0 -5 10 10" refX="6" markerUnits="userSpaceOnUse" markerWidth="24" markerHeight="24" orient="auto"><path d="M0,-5L10,0L0,5" fill="#778899"></path></marker></defs><defs><marker id="end-green-arrow" viewBox="0 -5 10 10" refX="6" markerUnits="userSpaceOnUse" markerWidth="18" markerHeight="18" orient="auto"><path d="M0,-5L10,0L0,5" fill="#48a448"></path></marker></defs><defs><marker id="ad_default" viewBox="0 -5 10 10" refX="6" markerUnits="userSpaceOnUse" markerWidth="18" markerHeight="18" orient="auto"><path d="M0,-5L10,0L0,5" fill="rgba(72, 164, 72, 0.5)"></path></marker></defs><defs><marker id="ad_unselect" viewBox="-1 -5 10 10" refX="6" markerUnits="userSpaceOnUse" markerWidth="18" markerHeight="18" orient="auto"><path d="M0,-5L10,0L0,5L0,-5" stroke="#48a448" fill="white"></path></marker></defs><defs><marker id="end-large-green-arrow" viewBox="0 -5 10 10" refX="6" markerUnits="userSpaceOnUse" markerWidth="24" markerHeight="24" orient="auto"><path d="M0,-5L10,0L0,5" fill="#48a448"></path></marker></defs><defs><marker id="end-red-arrow" viewBox="0 -5 10 10" refX="6" markerUnits="userSpaceOnUse" markerWidth="18" markerHeight="18" orient="auto"><path d="M0,-5L10,0L0,5" fill="#e34040"></path></marker></defs><defs><marker id="end-large-red-arrow" viewBox="0 -5 10 10" refX="6" markerUnits="userSpaceOnUse" markerWidth="24" markerHeight="24" orient="auto"><path d="M0,-5L10,0L0,5" fill="#e34040"></path></marker></defs><defs><marker id="end-orange-arrow" viewBox="0 -5 10 10" refX="6" markerUnits="userSpaceOnUse" markerWidth="18" markerHeight="18" orient="auto"><path d="M0,-5L10,0L0,5" fill="#FC9C56"></path></marker></defs><defs><marker id="end-large-orange-arrow" viewBox="0 -5 10 10" refX="6" markerUnits="userSpaceOnUse" markerWidth="24" markerHeight="24" orient="auto"><path d="M0,-5L10,0L0,5" fill="#FC9C56"></path></marker></defs><defs><marker id="end-lime-arrow" viewBox="0 -5 10 10" refX="6" markerUnits="userSpaceOnUse" markerWidth="18" markerHeight="18" orient="auto"><path d="M0,-5L10,0L0,5" fill="#AAD96F"></path></marker></defs><defs><marker id="end-large-lime-arrow" viewBox="0 -5 10 10" refX="6" markerUnits="userSpaceOnUse" markerWidth="24" markerHeight="24" orient="auto"><path d="M0,-5L10,0L0,5" fill="#AAD96F"></path></marker></defs><defs><marker id="end-cyan-arrow" viewBox="0 -5 10 10" refX="6" markerUnits="userSpaceOnUse" markerWidth="18" markerHeight="18" orient="auto"><path d="M0,-5L10,0L0,5" fill="#6AD1CB"></path></marker></defs><defs><marker id="end-large-cyan-arrow" viewBox="0 -5 10 10" refX="6" markerUnits="userSpaceOnUse" markerWidth="24" markerHeight="24" orient="auto"><path d="M0,-5L10,0L0,5" fill="#6AD1CB"></path></marker></defs><defs><marker id="end-yellow-arrow" viewBox="0 -5 10 10" refX="6" markerUnits="userSpaceOnUse" markerWidth="18" markerHeight="18" orient="auto"><path d="M0,-5L10,0L0,5" fill="#ffcf52"></path></marker></defs><defs><marker id="end-large-yellow-arrow" viewBox="0 -5 10 10" refX="6" markerUnits="userSpaceOnUse" markerWidth="24" markerHeight="24" orient="auto"><path d="M0,-5L10,0L0,5" fill="#ffcf52"></path></marker></defs><defs><marker id="end-purple-arrow" viewBox="0 -5 10 10" refX="6" markerUnits="userSpaceOnUse" markerWidth="18" markerHeight="18" orient="auto"><path d="M0,-5L10,0L0,5" fill="#C1A4FE"></path></marker></defs><defs><marker id="end-large-purple-arrow" viewBox="0 -5 10 10" refX="6" markerUnits="userSpaceOnUse" markerWidth="24" markerHeight="24" orient="auto"><path d="M0,-5L10,0L0,5" fill="#C1A4FE"></path></marker></defs>
                        <g data-sero-checktext><text><tspan dy="4" x="0">some text</tspan></text></g>
                    </svg>
                    <div data-sero-footer class="wrapper collapseFooter"></div>
                </div>
                <div class="${PREFIX}-checkAnswer-wrapper"></div>
                <div class="${PREFIX}-suggestedAnswers-wrapper"></div>
            </div>
        `;

        // Optional - Render optional Learnosity components like Check Answer Button, Suggested Answers List
        // first before rendering your question's components
        return Promise.all([
            lrnUtils.renderComponent('SuggestedAnswersList', el.querySelector(`.${PREFIX}-suggestedAnswers-wrapper`)),
            lrnUtils.renderComponent('CheckAnswerButton', el.querySelector(`.${PREFIX}-checkAnswer-wrapper`))
        ]).then(([suggestedAnswersList, checkAnswerResult]) => {
            this.suggestedAnswersList = suggestedAnswersList;
            console.log(this.suggestedAnswersList, checkAnswerResult)

            let canvas = el.querySelector('svg[data-sero-canvas]')
            this.AssessmentManager.setCanvasElement(canvas);

            let footer = el.querySelector("div[data-sero-footer]")
            this.AssessmentManager.setFooterElement(footer)

            //this.AssessmentManager.renderSKEAssessment(seroAssessment)

            //let formattedAnswerList = seroAssessment.items.map((item, index) => ({index: index, label: item.config.correctAnswer}))
            //this.suggestedAnswersList.setAnswers(formattedAnswerList)
        });
    }

    /**
     * Add public methods to the created question instance that is accessible during runtime
     *
     * Example: questionsApp.question('my-custom-question-response-id').myNewMethod();
     */
    registerPublicMethods() {
        const { init } = this;
        // Attach the methods you want on this object
        const facade = init.getFacade();

        facade.disable = () => {
            // TODO: Requires implementation
        };

        facade.enable = () => {
            // TODO: Requires implementation
        };

        facade.testSero = () => {
            console.log("testing sero")
        }
    }

    handleEvents() {
        const { events } = this;

        // TODO: Requires implementation - Make sure you trigger 'changed' event after users changes their responses
        // events.trigger('changed', responses);


        // "validate" event can be triggered when Check Answer button is clicked or when public method .validate() is called
        // so developer needs to listen to this event to decide if he wants to display the correct answers to user or not
        // options.showCorrectAnswers will tell if correct answers for this question should be display or not.
        // The value showCorrectAnswers by default is the value of showCorrectAnswers inside initOptions object that is used
        // to initialize question app or the value of the options that is passed into public method validate (like question.validate({showCorrectAnswers: false}))
        events.on('validate', options => {
            console.log("need to validate...")
            // TODO: Requires implementation
        });
    }
}
