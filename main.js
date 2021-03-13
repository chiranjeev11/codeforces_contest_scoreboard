$(document).ready(function(){
	let link;
	let apiKey = "Your API Key";
	let secretKey = "Your Secret Key";
	let contestId;
	let status;

	

	$('#fetch').click(function(){
		let link = $('#link').val();
		$(link.split('/')).each(function(index, element){
			if(Number(element)){
				contestId = element;
				return false;
			}
		});
		if(contestId){
			let randomNumber = 123458;
			let time = Math.floor((new Date()).getTime() / 1000 );
			let stringTohash = `${randomNumber}/contest.standings?apiKey=${apiKey}&contestId=${contestId}&time=${time}#${secretKey}`
			let hash = hex_sha512(stringTohash);
			let url = `https://codeforces.com/api/contest.standings?time=${time}&contestId=${contestId}&apiKey=${apiKey}&apiSig=${randomNumber}${hash}`
			status = 0;
			$.ajax({
				url: url,
				success: function(data, textStatus, xhr){
					if(data){
						status = 1;
					}

					if(status==1){
						$('#table').css('display','block');
						$('#text').css('display', 'none');
					}
					else{
						$('#table').css('display','none');
						$('#text').css('display', 'block');
					}
					$('#contestName').html(data.result.contest.name);
					displayRows(data);
					problems(data);
				},
				error: function(e){
					notify('You Entered Wrong Contest Id', 'danger')
					$('#table').css('display','none');
					$('#text').css('display', 'block');
					$('#contestant').empty();
					$('#problems').empty();
				}
			})
		}
		else{
			notify('Please Enter correct link', 'info')
			$('#contestant').empty();
			$('#problems').empty();
		}
	})

	function problems(data){

		$('#problems').empty();

		let prob = data.result.problems;
		let cols = `<th scope="col">
						#
					</th>
					<th scope="col">
						Handle
					</th>
					<th scope="col">
						=
					</th>
					<th scope="col">
						Penalty
					</th>`


		$(prob).each(function(index, element){
			cols += `<th scope="col">
							${element.index}
						</th>`
		})

		$('#problems').append(cols);


	}

	function displayRows(data){

		$('#contestant').empty();

		let contestant = data.result.rows;

		$(contestant).each(function(index, element){
			let row = `<tr>
						<th scope="row">${element.rank}</th>
						<td>${element.party.members[0].handle}</td>
						<td>${element.points}</td>
						<td>${element.penalty}</td>`;

			$(element.problemResults).each(function(index, element){
				if(Number(element.points)){

					let sec = Number(element.bestSubmissionTimeSeconds);
					let hr = parseInt(sec/3600);
					let min = parseInt((sec/3600-hr)*60);
					if(element.rejectedAttemptCount){
						row += `<td style="color:green;"><span>${element.rejectedAttemptCount}</span>+
									<p class="m-0">${hr}:${min}</p>
								</td>`
					}
					else{
						row += `<td style="color:green;">+
									<p class="m-0">${hr}:${min}</p>
								</td>`
					}
					
				}
				else{
					row += `<td></td>`
				}
			})
			row+=`</tr>`;
			$('#contestant').append(row);
		})

		
	}
	function notify(message, mode){
		alert = `<div class="alert alert-${mode}" role="alert">
				  ${message}
				  <button type="button" class="close" data-dismiss="alert" aria-label="Close">
				    <span aria-hidden="true">&times;</span>
				  </button>
				</div>`
		$('#form').prepend(alert)
	}
})
