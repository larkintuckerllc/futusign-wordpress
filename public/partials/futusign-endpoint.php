<?php
/**
 * futusign endpoint
 *
 * @link       https://github.com/larkintuckerllc
 * @since      2.1.2
 *
 * @package    futusign
 * @subpackage futusign/public/partials
 */
if ( ! defined( 'WPINC' ) ) {
	die;
}
/**
 * futusign endpoint
 *
 * @since    2.1.2
 */
function futusign_endpoint() {
	// TODO: ACCEPT QUERY OF PAGE_ID
	// TODO: 404 IF NONE
	function term_to_id($o) {
		return $o->term_id;
	}
	$subscribed_playlist_ids;
	$subscribed_override_ids = array();
	$images = array();
	$images_override = array();
	$webs = array();
	$webs_override = array();
	$youtube_videos = array();
	$youtube_videos_override = array();
	$slide_decks = array();
	$slide_decks_override = array();
	// SCREEN
	$screens = array();
	$args = array(
		'post_type' => 'futusign_screen',
		'posts_per_page' => -1,
		'page_id' => 416,
	);
	$loop = new WP_Query( $args );
	while ( $loop->have_posts() ) {
		$loop->the_post();
		$id = get_the_ID();
		// SUBSCRIBED PLAYLISTS
		$playlist_terms = get_the_terms( $id, 'futusign_playlist');
		$subscribed_playlist_ids = $playlist_terms ? array_map('term_to_id', $playlist_terms) : [];
		// SUBSCRIBED OVERRIDES
		if (class_exists( 'Futusign_Override' )) {
			$override_terms = get_the_terms( $id, 'futusign_override');
			$subscribed_override_ids = $override_terms ? array_map('term_to_id', $override_terms) : [];
		}
		// OVERLAY
		$overlay = get_field('overlay');
		$screens[] = array(
			'id' => $id,
			'title' => get_the_title(),
			'subscribedPlaylistIds' => $subscribed_playlist_ids,
			'subscribedOverrideIds' => $subscribed_override_ids,
			'overlay' => $overlay ? $overlay->ID : null
		);
	}
	wp_reset_query();
	// IMAGES
	$args = array(
		'post_type' => 'futusign_image',
		'posts_per_page' => -1,
		'tax_query' => array(
			array(
				'taxonomy' => 'futusign_playlist',
				'field'    => 'id',
				'terms'    => $subscribed_playlist_ids,
			),
		),
	);
	$loop = new WP_Query( $args );
	while ( $loop->have_posts() ) {
		$loop->the_post();
		$priority = get_field('priority');
		$images[] = array(
			'id' => get_the_ID(),
			'title' => get_the_title(),
			'file' => get_field('file'),
			'imageDuration' => intval(get_field('image_duration')),
			'priority' => $priority ? intval($priority) : 1
		);
	}
	wp_reset_query();
	// IMAGES OVERRIDE
	if (class_exists( 'Futusign_Override' )) {
		$args = array(
			'post_type' => 'futusign_image',
			'posts_per_page' => -1,
			'tax_query' => array(
				array(
					'taxonomy' => 'futusign_override',
					'field'    => 'id',
					'terms'    => $subscribed_override_ids,
				),
			),
		);
		$loop = new WP_Query( $args );
		while ( $loop->have_posts() ) {
			$loop->the_post();
			$priority = get_field('priority');
			$images_override[] = array(
				'id' => get_the_ID(),
				'title' => get_the_title(),
				'file' => get_field('file'),
				'imageDuration' => intval(get_field('image_duration')),
				'priority' => $priority ? intval($priority) : 1
			);
		}
	  wp_reset_query();
	}
	// MEDIA DECKS
	// MEDIA DECKS OVERRIDE
	// WEBS
	if (class_exists( 'Futusign_Web' )) {
		$args = array(
			'post_type' => 'futusign_web',
			'posts_per_page' => -1,
			'tax_query' => array(
				array(
					'taxonomy' => 'futusign_playlist',
					'field'    => 'id',
					'terms'    => $subscribed_playlist_ids,
				),
			),
		);
		$loop = new WP_Query( $args );
		while ( $loop->have_posts() ) {
			$loop->the_post();
			$priority = get_field('priority');
			$webs[] = array(
				'id' => get_the_ID(),
				'title' => get_the_title(),
				'url' => get_field('url'),
				'webDuration' => intval(get_field('web_duration')),
				'priority' => $priority ? intval($priority) : 1
			);
		}
		wp_reset_query();
		// WEBS OVERRIDE
		if (class_exists( 'Futusign_Override' )) {
			$args = array(
				'post_type' => 'futusign_web',
				'posts_per_page' => -1,
				'tax_query' => array(
					array(
						'taxonomy' => 'futusign_override',
						'field'    => 'id',
						'terms'    => $subscribed_override_ids,
					),
				),
			);
			$loop = new WP_Query( $args );
			while ( $loop->have_posts() ) {
				$loop->the_post();
				$priority = get_field('priority');
				$webs_override[] = array(
					'id' => get_the_ID(),
					'title' => get_the_title(),
					'url' => get_field('url'),
					'webDuration' => intval(get_field('web_duration')),
					'priority' => $priority ? intval($priority) : 1
				);
			}
		  wp_reset_query();
		}
	}
	// YOUTUBE VIDEOS
	if (class_exists( 'Futusign_Youtube' )) {
		$args = array(
			'post_type' => 'futusign_yt_video',
			'posts_per_page' => -1,
			'tax_query' => array(
				array(
					'taxonomy' => 'futusign_playlist',
					'field'    => 'id',
					'terms'    => $subscribed_playlist_ids,
				),
			),
		);
		$loop = new WP_Query( $args );
		while ( $loop->have_posts() ) {
			$loop->the_post();
			$priority = get_field('priority');
			$youtube_videos[] = array(
				'id' => get_the_ID(),
				'title' => get_the_title(),
				'url' => get_field('url'),
				'suggestedQuality' => get_field('suggested_quality'),
				'priority' => $priority ? intval($priority) : 1
			);
		}
		wp_reset_query();
		// YOUTUBE VIDEOS OVERRIDE
		if (class_exists( 'Futusign_Override' )) {
			$args = array(
				'post_type' => 'futusign_yt_video',
				'posts_per_page' => -1,
				'tax_query' => array(
					array(
						'taxonomy' => 'futusign_override',
						'field'    => 'id',
						'terms'    => $subscribed_override_ids,
					),
				),
			);
			$loop = new WP_Query( $args );
			while ( $loop->have_posts() ) {
				$loop->the_post();
				$priority = get_field('priority');
				$youtube_videos_override[] = array(
					'id' => get_the_ID(),
					'title' => get_the_title(),
					'url' => get_field('url'),
					'suggestedQuality' => get_field('suggested_quality'),
					'priority' => $priority ? intval($priority) : 1
				);
			}
		  wp_reset_query();
		}
	}
	// SLIDE DECKS
	$args = array(
		'post_type' => 'futusign_slide_deck',
		'posts_per_page' => -1,
		'tax_query' => array(
			array(
				'taxonomy' => 'futusign_playlist',
				'field'    => 'id',
				'terms'    => $subscribed_playlist_ids,
			),
		),
	);
	$loop = new WP_Query( $args );
	while ( $loop->have_posts() ) {
		$loop->the_post();
		$priority = get_field('priority');
		$slide_decks[] = array(
			'id' => get_the_ID(),
			'title' => get_the_title(),
			'file' => get_field('file'),
			'slideDuration' => intval(get_field('slide_duration')),
			'priority' => $priority ? intval($priority) : 1
		);
	}
	wp_reset_query();
	// SLIDE DECKS OVERRIDE
	if (class_exists( 'Futusign_Override' )) {
		$args = array(
			'post_type' => 'futusign_slide_deck',
			'posts_per_page' => -1,
			'tax_query' => array(
				array(
					'taxonomy' => 'futusign_override',
					'field'    => 'id',
					'terms'    => $subscribed_override_ids,
				),
			),
		);
		$loop = new WP_Query( $args );
		while ( $loop->have_posts() ) {
			$loop->the_post();
			$priority = get_field('priority');
			$slide_decks_override[] = array(
				'id' => get_the_ID(),
				'title' => get_the_title(),
				'file' => get_field('file'),
				'slideDuration' => intval(get_field('slide_duration')),
				'priority' => $priority ? intval($priority) : 1
			);
		}
		wp_reset_query();
	}
	// LAYERS
	// MONITOR
	// OVERLAY
	// WIDGETS
	header( 'Content-Type: application/json' );
	header( 'Cache-Control: no-cache, no-store, must-revalidate');
	echo '{';
	echo '"screen": ';
	echo json_encode( $screens[ 0 ]);
	echo ', "images": ';
	echo json_encode( $images );
	echo ', "imagesOverride": ';
	echo json_encode( $images_override );
	echo ', "webs": ';
	echo json_encode( $webs );
	echo ', "websOverride": ';
	echo json_encode( $webs_override );
	echo ', "youtubeVideos": ';
	echo json_encode( $youtube_videos );
	echo ', "youtubeVideosOverride": ';
	echo json_encode( $youtube_videos_override );
	echo ', "slideDecks": ';
	echo json_encode( $slide_decks );
	echo ', "slideDecksOverride": ';
	echo json_encode( $slide_decks_override );
	echo '}';
}
futusign_endpoint();
