// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { Configuration, OpenAIApi } from "openai";
import { rejects } from 'assert';
const configuration = new Configuration({
	organization: "org-FZJ5c3Bob4g1xWaBzShDAQ3o",
	apiKey: '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'
});

const openai = new OpenAIApi(configuration);

const getSugestionCode = async (text: string, retry: boolean) : Promise<string>=>{
	let response;
	let model = "code-davinci-001";
	return new Promise(async(resolve, rejects)=>{
		try {
			response = await requestApiAI(text, model);
			return resolve(response);
		} catch (error) {
			if(retry){
				model =  "code-davinci-002";
				try {
					response = await requestApiAI(text, model);
					return resolve(response);
				} catch (error) {
					console.error('Erro no plugin auto code complete', error);
					return rejects(error);
				}
			}else{
				return rejects(error);
			}
		}
	});
}

const requestApiAI = async(text:string, model: string)=>{
	const response = await openai.createCompletion({
		model,
		prompt: text,
		temperature: 0,
		max_tokens: 64,
		top_p: 1.0,
		frequency_penalty: 0.0,
		presence_penalty: 0.0,
	});

	return response.data.choices[0].text ? response.data.choices[0].text : '';
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "subconscious" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json

	vscode.commands.registerTextEditorCommand('subconscious.olaMundo', async(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit, ...args: any[])=>{
		const codeSugestion = await getSugestionCode(textEditor.document.getText(), true);
		textEditor.edit((editBuilder) => {
			editBuilder.insert(textEditor.selection.active, codeSugestion);
		});
	});

//d6kzfpy7jcw6obocluunr5x3qdkloiqdv7eylpdyvk5j2azyvyqq
	let disposable = vscode.commands.registerCommand('subconscious.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		//vscode.window.showInformationMessage('Hello World from subconscious!');
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
