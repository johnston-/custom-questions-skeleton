import { PREFIX } from './constants';
import PianoWidget from './components/PianoWidget';
import { Synth } from "keithwhor-audiosynth-packaged";
import { 
    notesOnly, 
    indeciesOnly, 
    updateNoteCoordinatesArrayFromResponseObject,
    sortNotes,
    handleAnswersList 
} from '../utils.js'
import '../style.css';


export default class PianoQuestion {
    constructor(init, lrnUtils) {
        this.init = init;
        this.events = init.events;
        this.lrnUtils = lrnUtils;
        this.el = init.$el.get(0);

        this.render().then(() =>{
            this.registerPublicMethods();
            this.handleEvents();
            const facade = init.getFacade()
            let savedResponse = facade.getResponse()
            if (init.state === 'review') {
                facade.updateUI()
                facade.disable();
            }

            if (init.state === 'resume') {
                facade.updateUI()
                
            }

            init.events.trigger('ready');
        });
    }

    render() {
      
        const { el, init, lrnUtils } = this;
        const { question, response } = init;

        // TODO: Requires implementation
        el.innerHTML = `
            <div class="${PREFIX} lrn-response-validation-wrapper">
                <div class="lrn_response_input">
                    <div class="piano-widget"></div>
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
        ]).then(([suggestedAnswersList]) => {
            this.suggestedAnswersList = suggestedAnswersList;
            this.piano = new PianoWidget(el.querySelector('.piano-widget'), null, {
                question,
                response
            })
            // render the piano to the screen
            this.piano.render()
            // adjust synth volume to be 30% to avoid distortion
            Synth.setVolume(0.30); 
        });
    }

    /**
     * Add public methods to the created question instance that is accessible during runtime
     *
     * Example: questionsApp.question('my-custom-question-response-id').myNewMethod();
     */
    registerPublicMethods() {
        const { init, el, piano } = this;
        // Attach the methods you want on this object
        const facade = init.getFacade();

        facade.disable = () => {
            const keyboard = el.querySelector('.keyboard')
            keyboard.classList.add('disabled')
            const keys = facade.getKeys()
            keys.forEach(key => {
                key.classList.add('disabled')
            });
            piano.disabled = true            
        };
        facade.enable = () => {
            piano.disabled = false     
        };
        facade.updateUI = () => {
            const response = facade.getResponse()
            if (response && response.value.indecies) {
                const keys = facade.getKeys()
                const indecies = facade.getResponse().value.indecies
                keys.forEach((key, idx) => {
                    if(indecies.includes(idx)) {
                        key.classList.toggle('selected')
                    }
                })
            }
        }
        facade.getKeys = () => {
            const keys = el.querySelectorAll('.key')
            return Array.from(keys)
        }
    }

    handleEvents() {
        const { el, events, init, piano, suggestedAnswersList } = this;
        const facade = init.getFacade() 
        
        const keyboard = el.querySelector('.keyboard')
        const feedback = el.querySelector('.feedback')
        const keys = facade.getKeys()

        let noteCoordinates = []

        if(init.state === 'resume') {
            const savedResponse = facade.getResponse()
            if(savedResponse) {
                updateNoteCoordinatesArrayFromResponseObject(savedResponse.value, noteCoordinates)
            }
         
        }

        
        for (let i=0; i < piano.notes.length; i++) {
            const key = keys[i]
            const note = piano.notes[i]
            key.addEventListener('click', () => {
                if (init.state === 'review') return
                if(suggestedAnswersList) { 
                    suggestedAnswersList.reset() 
                }
                keys.forEach((key) => {
                    if (key.classList.contains('correct') || key.classList.contains('incorrect')) {
                        key.classList.remove('correct')
                        key.classList.remove('incorrect')
                    }
                })
               
                feedback.classList.remove('correct')
                feedback.classList.remove('incorrect')
                keyboard.classList.remove('border-correct')
                keyboard.classList.remove('border-incorrect')

                i < 12 ? Synth.play('piano', note, 3, 2) : Synth.play('piano', note, 4, 2)
                
                key.classList.toggle('selected')
                // save the index along with the note as noteCoordinate, so UI knows in which octave the note was pressed,
                // splittable on _
                // eg C_0 = first octave C, C_12 = second octave C, etc
                // the index is not part of the validation, it is only used to highlight the note in the correct octave
                // in resume and review modes

                const noteCoordinate = note+'_'+i

                if(noteCoordinates.indexOf(noteCoordinate) === -1) {
                    noteCoordinates.push(noteCoordinate)
                } else {
                    noteCoordinates = noteCoordinates.filter(item => item !== noteCoordinate)
                }

                let responseObject = {
                    notes: notesOnly(noteCoordinates),
                    indecies: indeciesOnly(noteCoordinates)
                }
          
                events.trigger('changed', responseObject)
            })     
              
        }
                     
        this.events.on('validate', options => {
       
            const correct = facade.isValid()
            
            const selectedKeys = el.querySelectorAll('.selected')

            if (correct) {
                if(feedback.classList.contains('incorrect')) {
                    feedback.classList.remove('incorrect')
                }
                feedback.classList.toggle('correct');

                if(keyboard.classList.contains('border-incorrect')) {
                    keyboard.classList.remove('border-incorrect')
                }
                keyboard.classList.add('border-correct');
              
                for (let key of selectedKeys) {
                        if(key.classList.contains('incorrect')) {
                            key.classList.remove('incorrect')
                        }
                        key.classList.add('correct');
                 }
                  
            } else {
                if(feedback.classList.contains('correct')) {
                    feedback.classList.remove('correct')
                }
                feedback.classList.add('incorrect');

                if(keyboard.classList.contains('border-correct')) {
                    keyboard.classList.remove('border-correct')
                }
                keyboard.classList.add('border-incorrect');

                for (let key of selectedKeys) {
                    if(key.classList.contains('correct')) {
                        key.classList.remove('correct')
                    }
                    key.classList.add('incorrect');
                 }
            }

            if(!correct && options.showCorrectAnswers && suggestedAnswersList) {
                const validResponse = facade.getQuestion().valid_response
                let validResponseNoteCorrdinates = updateNoteCoordinatesArrayFromResponseObject(validResponse, [])
                const notesInOrder = sortNotes(validResponseNoteCorrdinates)

                suggestedAnswersList.reset()
                suggestedAnswersList.setAnswers(handleAnswersList(notesInOrder))
            }

        });
    }
}
