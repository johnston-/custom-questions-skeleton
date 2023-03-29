export default class Scorer {
    constructor(question, response) {
        this.question = question;
        this.response = response;
    }

    /**
     * Check if the current question's response is valid or not
     * (Required)
     * @returns {boolean}
     */
    isValid() {
        // TODO: Requires implementation
        return this.response && this.response.items.reduce((s,c) => {
            return s && scoreItem(c, this.response.links)
        }, true)
    }

    /**
     * Returns an object displaying the validation state of each individual item inside the stored response
     * For example:
     * The student response value is: { min: 10, max: 20 } and our correct answer is { min: 10, max: 30 }
     * Then we expect the result of this validateIndividualResponses will be:
     * { min: true, max: false }
     * @returns {{}|null}
     */
    validateIndividualResponses() {
        // iterate through assessment items
        return this.response.items.map(x => ({[x.id]: scoreItem(x, this.response.links)}))
        //return null;
    }

    /**
     * Returns the score of the stored response
     * @returns {number|null}
     */
    score() {
        if(!this.response) return null;
        
        let total = this.response.items.reduce((s,c) => {
            let correctNum = ["connectTo", "dragDrop"].includes(c.type) ? countUserLinks(c, this.response.links)[1] : 1
            return s + correctNum
        }, 0)

        let correct = this.response.items.reduce((s,c) => {
            let correctNum = ["connectTo", "dragDrop"].includes(c.type) ? countUserLinks(c, this.response.links)[0] : scoreItem(c, this.response.links) ? 1 : 0
            return s + correctNum
        }, 0)

        let correctPct = correct > 0 ? correct/total : 0
        let formatted = Math.round(correctPct*100)
        //console.log(correct, total, correctPct, formatted)
        return formatted;
    }

    /**
     * Returns the possible max score of the stored response
     * @returns {number}
     */
    maxScore() {
        // TODO: Requires implementation
        return 100;
    }

    /**
     * Check if the current question is scorable or not.
     * For example:
     * - If there is no valid response data set in the question, this method should return false
     * - If this question type is not scorable (like an essay or open ended question) then this will return false
     * @returns {boolean}
     */
    canValidateResponse() {
        return true;
    }
}

function scoreItem(item, links) {
    if(["connectTo", "dragDrop", "arrowDirection"].includes(item.type)) return scoreUserLinks(item, links);
    else return scoreUserAnswer(item);
}

function scoreUserAnswer(item) {
    return item.config.userAnswer && item.config.userAnswer === item.config.correctAnswer ? true : false
}

function scoreUserLinks(item, links) {
    return item.config.userLinks && item.config.correctLinks.reduce((s,c) => {
        let matchingLink = links.find(e => e.assessmentId === item.id && e.source === c.source && e.target === c.target) ? true : false      
        return s && matchingLink
    }, true) ? true : false
}

function countUserLinks(item, links) {
    let numTotal = item.config.correctLinks.length
    let numCorrect = item.config.userLinks ? item.config.userLinks.filter(e => {
        let cur = links.find(z => z.id === e)
        return item.config.correctLinks.find(z => z.source === cur.source && z.target === cur.target)
    }).length : 0
    return [numCorrect, numTotal]
}