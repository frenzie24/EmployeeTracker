let inquirer = require('inquirer');


// class prompter requires a questions obj and a callback function when initialized
class Prompter {
    constructor(questions, handleAnswers) {
        if (!handleAnswers){
            throw new Error('handleAnswers for this prompt are undefined.');
        }
        if (!questions)
            throw new Error('Params for this prompt are undefined');
       

        if (!Array.isArray(questions)) questions = [questions];
        this.questions = questions;
        this.handleAnswers = handleAnswers;

        // for every question, add validateInput and filterInput to their object if they are not predefined
        this.questions.map(question => {
            if(!this.checkArg(question.name) || !this.checkArg(question.type) || !this.checkArg(question.message)) {
                throw new Error('Name, type, and message properties of all questions must be defined as strings.')
            } 
            question.validate = question.validate ? question.validate : this.validateInput;
            question.filter = question.filter ? question.filter : this.filterInput;

        });

        if (typeof this.handleAnswers != 'function')
            throw new Error('handleAnswers must be a function.')


    }

    //start prompting the user for input answering passed questions to be handled by passed handleAnswers
    startPrompt = async () => {
        // if questions or handleAnswers are not defined throw an error
        if (!this.questions) throw new Error('Cannot start prompt. Questions for this prompt are undefined');
        if (!this.handleAnswers) throw new Error('Cannot start prompt. Answer Handling for this prompt is undefined');
        // prompt called
        await inquirer.prompt(this.questions).then(answer => {
            this.handleAnswers(answer);
        });
    }
    
    checkArg(arg) {
        if (!arg) return false;
        if (typeof arg !== 'string') return false;
        return true;
    }

    // default filter callback
    filterInput(input) {
        return input.trim();
    }
    // defualt validate callback
    validateInput(input) {
        if (!input.length) {
            return 'Input required';
        }
        return true;
    }
}
module.exports = Prompter;