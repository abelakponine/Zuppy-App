function showStories(){
	location.href = '#stories';
	$('#data-loader').show();
	$('#stories').css('display','flex');
}
function closeStories(){
	goBack();
	$('#data-loader,#stories').hide();
}

function processStories(data){
	data = JSON.parse(data);
	let type1 = ["jpg","png"];
	let type2 = ["gif","mp4","3gp"];
	let files = JSON.parse(data.fileList);
	// for story thumnails
	let ext1 = getFileExt(files[0].filename);
	let path = files[0].filepath;
	let dateCreated = data.dateCreated+" &sdot; "+data.timeCreated;
	let storyObject = $('#story-feed .prototype');

	if (type1.includes(ext1)){
		storyObject.find('.storyfile').attr('poster',path);
		storyObject.attr('data-author',getCookies('id'));
		$('#rightcol #header .first').attr({'poster': path,'src':'#t=0'});
	}
	if (type2.includes(ext1)){
		storyObject.find('.storyfile').attr({'poster':'','src':path+"#t=0.001"});
		storyObject.attr('data-author',getCookies('id'));
	}
	storyObject.find('.timestamp').html('&nbsp;at '+dateCreated);

	// for story playlist
	let storyPlayPrototype = $('#story-player .prototype').clone();
	storyPlayPrototype.removeClass('prototype').show();
	storyPlayPrototype.empty();
	
	for (file of files){
		let ext2 = getFileExt(file.filename);
		let path2 = file.filepath;
		
		let author = file.author;
		let storyPlayWrapper = $('#story-player .prototype .story-wrapper').clone();

		storyPlayWrapper.addClass('story'+getCookies('id'));
		if (type1.includes(ext2)){
			storyPlayWrapper.find('.storyfile').attr('poster',path2);
			storyPlayWrapper.attr('data-type','image');
		}
		if (type2.includes(ext2)){
			storyPlayWrapper.find('.storyfile').attr('src',path2);
			storyPlayWrapper.prop('data-type','video');
		}
		
		storyPlayWrapper.find('.author').text("@"+author);
		storyPlayWrapper.find('.timestamp').html('&nbsp;at '+dateCreated);
		if (!$('#story-player')[0].contains($('.author'+getCookies('id'))[0])){
			storyPlayPrototype.append(storyPlayWrapper);
		}
		else {
			$('#story-player .author'+getCookies('id')).append(storyPlayWrapper);
		}
	}
	
	storyPlayPrototype.addClass('author'+getCookies("id"));
	$('#story-player .prototype').before(storyPlayPrototype);
	
	setTimeout((e)=>{
		$('#storyUploader .counter').text("");
		$('#storyUploader').removeClass('.uploading').hide();
	}, 3000);
}

function playStory(elem){
	if ($("#story-player .st-container").not(".prototype").length < 1){
		alert("!Oops story playlist is empty,\r\nplease share a story");
		event.stopPropagation();
		return false;
	}
	storyElem = elem;
	story_aid = $(elem).data('author');
	let stories = $('#story-player .author'+story_aid+' .story'+story_aid);
	storylength = $('#story-player .author'+story_aid+' .story'+story_aid).length;
	activeStory = 0;
	storyTimer = 0;
	activeStoryAuthor = 0;

	st_player = setInterval(()=>{
		
		authors = $('#story-player .st-container');
		
		if (stories.eq(activeStory).data('type') == 'image'){
			storyTimer = storyTimer+3; // 10 secs
		}
		if (stories.eq(activeStory).data('type') == 'video'){
			storyTimer = storyTimer+(30/100); // 30 secs
		}
		$('.st-meter').val(storyTimer);
		if ($('.st-meter').val() >= 30){
			// goto next slide
			if (activeStory < storylength-1){
				activeStory++;
				$('#story-player .story-wrapper').hide();
				$('#story-player .story'+story_aid).eq(activeStory).show();
			}
			else if (activeStory >= storylength-1){
				story_aid = $(elem.nextElementSibling).data('author');
				activeStory = 0;
				activeStoryAuthor++;
				$('#story-player .st-container, #story-player .story-wrapper').hide();
				$('#story-player .author'+story_aid+', #story-player .story'+story_aid).eq(activeStory).show();
				$('#story-player .author'+story_aid+', #story-player .story'+story_aid).eq(activeStory).find('video')[0].play();
			}
			if (activeStoryAuthor >= authors.length-1 || story_aid == undefined){
				clearInterval(st_player);
				$('#story-player, #story-player .st-container, #story-player .story-wrapper').hide();
			}
			storyTimer = 0;
			$('.st-meter').val(0);
		}
	}, 1000);
	
	$('#story-player .story-wrapper').hide();
	$('#story-player').css('display','flex');
	$('#story-player .author'+story_aid).show();
	$('#story-player .story'+story_aid).eq(0).show();
	$('#story-player .story'+story_aid).eq(0).find('video')[0].play();
}

function slideLeft(){
	activeStory--;
	storyTimer = 0;
	$('#story-player .story-wrapper').hide();
	$('#story-player .story'+story_aid).eq(activeStory).show();
	$('#story-player .story'+story_aid).eq(activeStory+1).find('video')[0].pause();
	$('#story-player .story'+story_aid).eq(activeStory+1).find('video')[0].currentTime=0;
	$('#story-player .story'+story_aid).eq(activeStory).find('video')[0].play();
	if (activeStory < 0){;
		story_aid = $(storyElem.previousElementSibling).data('author');
		activeStory = 0;
		activeStoryAuthor--;
		$('#story-player .st-container, #story-player .story-wrapper').hide();
		$('#story-player .author'+story_aid+', #story-player .story'+story_aid).eq(activeStory).show();
	}
	if (activeStoryAuthor < 0 || story_aid == undefined){
		clearInterval(st_player);
		$('#story-player, #story-player .st-container, #story-player .story-wrapper').hide();
	}
}
function slideRight(){
	activeStory++;
	storyTimer = 0;
	$('#story-player .story-wrapper').hide();
	$('#story-player .story'+story_aid).eq(activeStory).show();
	if (activeStory >= storylength){
		$('#story-player .author'+story_aid+', #story-player .story'+story_aid).eq(activeStory-1).find('video')[0].pause();
		$('#story-player .author'+story_aid+', #story-player .story'+story_aid).eq(activeStory-1).find('video')[0].currentTime=0;
		$('#story-player .author'+story_aid+', #story-player .story'+story_aid).eq(activeStory).find('video')[0].play();
		story_aid = $(storyElem.nextElementSibling).data('author');
		activeStory = 0;
		activeStoryAuthor++;
		$('#story-player .st-container, #story-player .story-wrapper').hide();
		$('#story-player .author'+story_aid+', #story-player .story'+story_aid).eq(activeStory).show();
	}
	if (activeStoryAuthor >= authors.length-1 || story_aid == undefined){
		clearInterval(st_player);
		$('#story-player, #story-player .st-container, #story-player .story-wrapper').hide();
	}
}
