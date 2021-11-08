$(document).ready(function() {
	const debuffIcons = {
		'flare': 	'./img/ffZgfiI.png',
		'aero': 	'./img/Vr567qi.png',
		'eruption': './img/BLmvVqa.png',
		'gaze': 	'./img/eRvTfOw.png',
		'blizzard': './img/ATQwyiB.png',
		'stack': 	'./img/PKIAmmN.png',
		'fire':		'./img/WLHaZGo.png',
		'water':	'./img/PtCMeO2.png'
	};

	const answers = [
		['F', 'L', 'R'],
		['F', 'L', 'S'],
		['F', 'K', 'P'],
		['H', 'L', 'M']
	];

	let answerKey = 0;

	let melee = true;

	let partyDebuffs = [];

	let questionNum = 0;
	
	const HOLD_TIME = 3000;

	const ANSWER_TEMPLATE = `
		<input type="radio" id="answer-F" name="position-question" value="F">
		<label for="answer-F">F</label><br>
		<input type="radio" id="answer-H" name="position-question" value="H">
		<label for="answer-H">H</label><br>
		<input type="radio" id="answer-K" name="position-question" value="K">
		<label for="answer-K">K</label><br>
		<input type="radio" id="answer-L" name="position-question" value="L">
		<label for="answer-L">L</label><br>
		<input type="radio" id="answer-M" name="position-question" value="M">
		<label for="answer-M">M</label><br>
		<input type="radio" id="answer-P" name="position-question" value="P">
		<label for="answer-P">P</label><br>
		<input type="radio" id="answer-R" name="position-question" value="R">
		<label for="answer-R">R</label><br>
		<input type="radio" id="answer-S" name="position-question" value="S">
		<label for="answer-S">S</label><br>
		`

	let answerLog = []
	let questionsAndAnswers = [
		{
			'question': '<p>Are you melee or ranged?</p>',
			'answersHtml': `
				<input type='radio' id='answer-melee' name='role-answer'>
				<label for='answer-melee'>Melee</label><br>
				<input type='radio' id='answer-ranged' name='role-answer'>
				<label for='answer-ranged'>Ranged</label><br>`,
			'handler': () => {
				let selectedList = Math.floor(Math.random() * 2);
				if ($('#answer-ranged:checked').length == 1) {
					melee = false;
					$('#role-selected').html('<p>Ranged selected</p>');
					console.log($('div#player-list div')[selectedList * 2 + 1])
					$('div#player-list div')[selectedList * 2 + 1].style = 'background: #FFADAD';
					answerKey = selectedList * 2 + 1;
				}
				else {
					$('#role-selected').html('<p>Melee selected</p>');
					melee = true;
					$('div#player-list div')[selectedList * 2].style = 'background: #FFADAD';
					answerKey = selectedList * 2;
				}

				if (answerKey >= 2) {
					if (partyDebuffs[answerKey].debuffList.indexOf('gaze') > -1) {
						answerKey = 2;
					}
					else {
						answerKey = 3;
					}
				}
			},
			'holdTime': 0
		},
		{
			'question': '<p>Does someone need to swap out?</p>',
			'answersHtml': `
				<input type='radio' id='answer-yes' name='position-answer'>
				<label for='answer-yes'>Yes</label><br>
				<input type='radio' id='answer-no' name='position-answer'>
				<label for='answer-no'>No</label><br>`,
			'handler': () => {
				let selectedAnswer = '';
				let correctAnswer = '';
				if(partyDebuffs[2].debuffType == partyDebuffs[3].debuffType) {
					correctAnswer = 'Yes';
					if ($('#answer-yes:checked').length == 1) {
						$('#result-text').text('Correct!');
						selectedAnswer = 'Yes';
					}
					else {
						$('#result-text').text('Incorrect: Someone needs to swap');
						selectedAnswer = 'No';
					}
				}
				else{
					correctAnswer = 'No';
					if ($('#answer-no:checked').length == 1) {
						$('#result-text').text('Correct!');
						selectedAnswer = 'No';
					}
					else {
						$('#result-text').text('Incorrect: Nobody needs to swap out');
						selectedAnswer = 'Yes';
					}
				}
				answerLog.push({'correct': correctAnswer, 'result': selectedAnswer})
			},
			'holdTime': HOLD_TIME
		},
		{
			'question': `<p>Where do you stand for the first rewind?</p>`,
			'answersHtml': ANSWER_TEMPLATE,
			'handler': rewindAnswerHandler,
			'holdTime': HOLD_TIME
		}, 
		{
			'question': `<p>Where do you stand for the second rewind?</p>`,
			'answersHtml': ANSWER_TEMPLATE,
			'handler': rewindAnswerHandler,
			'holdTime': HOLD_TIME
		}, 
		{
			'question': `<p>Where do you stand for the third rewind?</p>`,
			'answersHtml': ANSWER_TEMPLATE,
			'handler': rewindAnswerHandler,
			'holdTime': HOLD_TIME
		}, 
	];

	function rewindAnswerHandler() {
		const selectedAnswer = $('input[type=radio]:checked').val();
		const correctAnswer = answers[answerKey][questionNum-2];

		if (correctAnswer == selectedAnswer) {
			$('#result-text').html(`<p>Correct!</p>`)
		}
		else {
			$('#result-text').html(`<p>Incorrect, you should be at ${correctAnswer}</p>`)
		}
		answerLog.push({'correct': correctAnswer, 'result': selectedAnswer})
	}

	function generateQuiz() {
		let debuffSequences = [
			['water', 'gaze', 'aero'],
			['water', 'aero', 'aero']
		]

		partyDebuffs.push({
			'role': 'Melee:',
			'debuffList': ['fire']
		})

		partyDebuffs.push({
			'role': 'Ranged:',
			'debuffList': ['fire']
		})

		let debuffType = Math.floor(Math.random() * 2)
		
		partyDebuffs.push({
			'role': 'Melee:',
			'debuffList': debuffSequences[debuffType],
			'debuffType': debuffType
		})

		debuffType = Math.floor(Math.random() * 2)
		partyDebuffs.push({
			'role': 'Ranged:',
			'debuffList': debuffSequences[debuffType],
			'debuffType': debuffType
		})

		console.log(partyDebuffs)
		for(let i = 0; i < 4; i++) {
			let debuffHtml = '<div'
			debuffHtml += `><p>${partyDebuffs[i].role} ${getImageList(partyDebuffs[i].debuffList)}</p></div>`
			$('#player-list').append(debuffHtml)
		}
	}

	function runQuiz(){
		questionsAndAnswers[questionNum].handler();
		$('#answers *').prop('disabled', true);
		$('#answer-button').prop('disabled', true);
		setTimeout(() => {
			if(questionNum < questionsAndAnswers.length - 1) {
				questionNum++;
				$('#question').html(questionsAndAnswers[questionNum].question);
				$('#answers').html(questionsAndAnswers[questionNum].answersHtml);
				$('#answer-button').prop('disabled', false);
				$('#result-text').text('');
			}
			else {
				const questions = ['Swap needed?', 'First rewind', 'Second rewind', 'Third rewind']
				$('#question').text('');
				$('#answers').text('');
				$('#answer-button').hide();
				let resultsText = `<p>The answers were:</p>
					<table>
						<thead>
							<td style="width: 160px;">Question</td>
							<td style="width: 160px;">Correct answer</td>
							<td style="width: 160px;">Your answer</td>
						</thead>
				`;
				for(let i = 0; i < answerLog.length; i++) {
					resultsText += `
						<tr>
							<td>${questions[i]}</td>
							<td>${answerLog[i].correct}</td>
							<td>${answerLog[i].result}</td>
						</tr>
						`
				}
				resultsText += `</table>`;
				$('#result-text').html(resultsText);
			}
		}, questionsAndAnswers[questionNum].holdTime);
	}


	function getImageList(debuffs){
		const len = debuffs.length;
		let output = '';
		for(let i = 0; i < len; i++) {
			output += `<img src='${debuffIcons[debuffs[i]]}' style='float: right;'/> `;
		}
		return output;
	}

	function resetQuiz() {
		questionNum = 0;
		answerLog = [];
		partyDebuffs = [];
		$('#player-list').text('');
		$('#question').html(questionsAndAnswers[questionNum].question);
		$('#answers').html(questionsAndAnswers[questionNum].answersHtml);
		$('#answer-button').show();
		$('#answer-button').prop('disabled', false);
		$('#result-text').text('');
		generateQuiz()
	}

	$('#answer-button').click(runQuiz);
	$('#reset-button').click(resetQuiz);
	resetQuiz();
})