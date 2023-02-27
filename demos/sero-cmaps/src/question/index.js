import { PREFIX } from './constants';
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
                //this.AssessmentManager.renderReviewAssessment()
            }
            else if (init.state === "resume") {
                let response = init.getFacade().getResponse();
                this.AssessmentManager.renderSavedAssessment(response.value)
            }
            else {
                let seroId = init.question["sero_assessment_id"]
                fetch(`https://api.serolearn.com/get-assignment?uid=${seroId}`)
                .then(ok => ok.json())
                .then(ok => {
                    this.AssessmentManager.renderAssessment(ok.assessment)
                    init.events.trigger('ready');
                })
            }
            
            
        });
    }

    render() {
        const { el, init, lrnUtils, } = this;
        const { question, response } = init;

        el.innerHTML = `
            <div class="${PREFIX} lrn-response-validation-wrapper">
                <div class="lrn_response_input" style="border: 1pt solid black">
                    <svg data-sero-canvas class="sero_svg_canvas"></svg>
                    <div data-sero-footer class="sero_footer_wrapper collapseFooter"></div>
                </div>
            </div>
            <div name="buttons">
                <div class="${PREFIX}-suggestedAnswers-wrapper"></div>
            </div>
        `;


        // Optional - Render optional Learnosity components like Check Answer Button, Suggested Answers List
        // first before rendering your question's components
        return Promise.all([
            lrnUtils.renderComponent('SuggestedAnswersList', el.querySelector(`.${PREFIX}-suggestedAnswers-wrapper`))
        ]).then(([suggestedAnswersList]) => {
            this.suggestedAnswersList = suggestedAnswersList;
            //console.log(this.suggestedAnswersList)
            
            let canvasWidth = el.clientWidth || 1000;
            let canvasHeight = el.clientHeight || 800;
            
            this.AssessmentManager.setDimensions(canvasWidth, canvasHeight)

            let canvas = el.querySelector('svg[data-sero-canvas]')
            this.AssessmentManager.setCanvasElement(canvas);sd

            let footer = el.querySelector("div[data-sero-footer]")
            this.AssessmentManager.setFooterElement(footer);
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
