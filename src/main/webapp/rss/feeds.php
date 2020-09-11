<?php
	function clean_rss($data){
		return str_ireplace(']]','', str_ireplace('[CDATA[','', $data));
	}
	$link = "https://www.bbc.co.uk/news/world";
	$dom = new DOMDocument();
	$xml = simplexml_load_string(str_ireplace('<atom10:link xmlns:atom10="http://www.w3.org/2005/Atom" rel="self" type="application/rss+xml" href="http://rss.cnn.com/rss/edition_world" /><feedburner:info uri="rss/edition_world" /><atom10:link xmlns:atom10="http://www.w3.org/2005/Atom" rel="hub" href="http://pubsubhubbub.appspot.com/" />', '', file_get_contents($link)));
	
	// foreach ($xml->channel->children() as $key => $value){
	// 	switch ($key) {
	// 		case 'item':
	// 			foreach ($value as $key => $value) {
	// 				echo "$key <br>";
	// 			}
	// 			break;
	// 	}
	// }

	// foreach ($xml->channel->children() as $key => $value){
	// 	switch ($key) {
	// 		case 'item':
	// 			var_dump($value->children());
	// 			echo clean_rss($value->children()->title)."<br>"
	// 				.clean_rss($value->children()->description)."<br>"
	// 				.clean_rss($value->children()->content)."<br>"
	// 				.clean_rss($value->children()->link)."<br>"
	// 				.clean_rss($value->children()->pubDate)."<br></br>";
	// 			break;
	// 	}

	// }

?>