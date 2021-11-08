$(document).ready(function() {
	const debuffs = {
		'flare': 	'./img/ffZgfiI.png',
		'aero': 	'./img/Vr567qi.png',
		'eruption': './img/BLmvVqa.png',
		'gaze': 	'./img/eRvTfOw.png',
		'blizzard': './img/ATQwyiB.png',
		'stack': 	'./img/PKIAmmN.png'
	};

	const answers = {
		'flare': 	'out',
		'aero': 	'out',
		'eruption': 'max melee',
		'gaze': 	'center',
		'blizzard': 'center',
		'stack': 	'center'
	};

	const answersToPosition = {	
		'out': 'Get to the edge of the arena',
		'max melee': 'Get to max melee range',
		'center': 'Stack up in the center'
	}

	let correctAnswers = [];
	let debuffSequence = [];
	let questionNum = 0;

	function generateQuiz() {
		let sequences = ['eruption', 'blizzard', 'aero', 'flare', 'gaze', 'stack'];

		function removeDebuffs(debuffName) {
			if (debuffName == "flare") {
				sequences.splice(sequences.indexOf("flare"), 1);
				sequences.splice(sequences.indexOf("aero"), 1);
				sequences.splice(sequences.indexOf("gaze"), 1);
				sequences.splice(sequences.indexOf("stack"), 1);
			}
			else if (debuffName == "gaze") {
				sequences.splice(sequences.indexOf("gaze"), 1);
				sequences.splice(sequences.indexOf("flare"), 1);
				sequences.splice(sequences.indexOf("blizzard"), 1);
				sequences.splice(sequences.indexOf("stack"), 1);
			}
			else if (debuffName == "stack") {
				sequences.splice(sequences.indexOf("stack"), 1);
				sequences.splice(sequences.indexOf("flare"), 1);
				sequences.splice(sequences.indexOf("blizzard"), 1);
				sequences.splice(sequences.indexOf("gaze"), 1);
				console.log(sequences)
			}
			else if (debuffName == "blizzard") {
				sequences.splice(sequences.indexOf("blizzard"), 1);
				sequences.splice(sequences.indexOf("aero"), 1);
				sequences.splice(sequences.indexOf("stack"), 1);
				sequences.splice(sequences.indexOf("gaze"), 1);
			}
			else if (debuffName == "aero") {
				sequences.splice(sequences.indexOf("aero"), 1);
				sequences.splice(sequences.indexOf("flare"), 1);
				sequences.splice(sequences.indexOf("blizzard"), 1);
			}
		}

		debuffSequence = [];
		questionNum = 0;
		$('input[type=radio]:checked').prop('checked', false);
		$('span#debuff-num').text('third');
		$('#result-text').text('');
		$('#answers *').prop('disabled', false);
		$('#answers').show();
		$('#debuff-0').attr('style', '');
		$('#debuff-1').attr('style', '');
		$('#debuff-2').attr('style', 'border: 3px red solid;');

		let debuffName = sequences[Math.floor(Math.random() * sequences.length)];
		debuffSequence.push(debuffName);

		if (debuffName == "eruption") {
			sequences.splice(sequences.indexOf("eruption"), 1);
		}
		else {
			removeDebuffs(debuffName);
		}
		
		let nextDebuff = Math.floor(Math.random() * sequences.length)
		debuffName = sequences[nextDebuff];

		if(debuffSequence[0] == "eruption") {
			removeDebuffs(debuffName);
		}
		debuffSequence.push(debuffName);
		sequences.splice(nextDebuff, 1)
		debuffSequence.push(sequences[0]);

		for(let i = 0; i < 3; i++) {
			$(`#debuff-${i}`).attr('src', debuffs[debuffSequence[i]]);
		}
	}

	function runQuiz() {
		const chosenAnswer = $('input[type=radio]:checked');

		if(questionNum == 3) {
			$('#result-text').text('Press the reset button');
		}
		else if(chosenAnswer.length === 0) {
			$('#result-text').text('No answer selected');
		}
		else {
			const questionCountText = ['first', 'second']
			let correctAnswer = answers[debuffSequence[2-questionNum]];
			let answerRecord = {'correct': answersToPosition[correctAnswer], 'result': ''}
			
			if (chosenAnswer[0].value === correctAnswer) {
				$('#result-text').text('Correct!');
				answerRecord.result = 'Answered correctly';
			}
			else {
				$('#result-text').text(`Incorrect: ${answersToPosition[correctAnswer]}`);
				answerRecord.result = 'Answered incorrectly';
			}
			questionNum ++;
			correctAnswers.push(answerRecord);
			$('#answers *').prop('disabled',true);

			console.log(`Question: ${questionNum}`, answerRecord)
			setTimeout(() => {
				$('input[type=radio]:checked').prop('checked', false);
				$('span#debuff-num').text(questionCountText[2-questionNum]);
				$('#answers *').prop('disabled', false);
				$(`#debuff-${2-questionNum}`).attr('style', 'border: 3px red solid;');
				$(`#debuff-${3-questionNum}`).attr('style', '');
				if (questionNum == 3) {
					$('#answers').hide();
					$('#result-text').html(`The answers were
						<br><img src='${$('#debuff-2').attr('src')}'> ${correctAnswers[0].correct} (${correctAnswers[0].result})
						<br><img src='${$('#debuff-1').attr('src')}'> ${correctAnswers[1].correct} (${correctAnswers[1].result})
						<br><img src='${$('#debuff-0').attr('src')}'> ${correctAnswers[2].correct} (${correctAnswers[2].result})`);
					correctAnswers = []
				}
				else {
					$('#result-text').html(`&nbsp;`);
				}
			}, 3000)
		}
	}

	$('#answer-button').click(runQuiz);
	$('#reset-button').click(generateQuiz);

	generateQuiz();
})