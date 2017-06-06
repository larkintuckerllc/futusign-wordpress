<?php
// DEGUG 2
global $futusign_debug;
if ($futusign_debug === '2') {
	echo 2;
	die();
}
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
// DEGUG 3
if ($futusign_debug === '3') {
	echo 3;
	die();
}
/**
 * futusign term to id
 * @param    object     $o      The term
 * @return   number      the id
 *
 * @since    2.2.7
 */
function futusign_term_to_id($o) {
	return $o->term_id;
}
/**
 * futusign endpoint
 * @param    number     $screen_id      The screen id
 *
 * @since    2.1.2
 */
function futusign_endpoint($screen_id) {
	global $futusign_debug;
	// DEGUG 6
	if ($futusign_debug === '6') {
		echo 6;
		die();
	}
	$screen = null;
	$subscribed_playlist_ids;
	$subscribed_override_ids = array();
	$images = array();
	$images_override = array();
	$media_decks = array();
	$media_decks_override = array();
	$webs = array();
	$webs_override = array();
	$youtube_videos = array();
	$youtube_videos_override = array();
	$slide_decks = array();
	$slide_decks_override = array();
	$layers = array();
	$overlay = null;
	$ov_widgets = array();
	$monitor = null;
	// SCREEN
	$args = array(
		'post_type' => 'futusign_screen',
		'posts_per_page' => -1,
		'page_id' => $screen_id,
	);
	// DEGUG 7
	if ($futusign_debug === '7') {
		echo 7;
		die();
	}
	$loop = new WP_Query( $args );
	while ( $loop->have_posts() ) {
		// DEGUG 8
		if ($futusign_debug === '8') {
			echo 8;
			die();
		}
		$loop->the_post();
		$id = get_the_ID();
		// SUBSCRIBED PLAYLISTS
		$playlist_terms = get_the_terms( $id, 'futusign_playlist');
		$subscribed_playlist_ids = $playlist_terms ? array_map('futusign_term_to_id', $playlist_terms) : [];
		// SUBSCRIBED OVERRIDES
		if (class_exists( 'Futusign_Override' )) {
			$override_terms = get_the_terms( $id, 'futusign_override');
			$subscribed_override_ids = $override_terms ? array_map('futusign_term_to_id', $override_terms) : [];
		}
		// POLLING
		$polling = get_field('polling');
		// OVERLAY
		$overlayPost = get_field('overlay');
		$screen = array(
			'id' => $id,
			'title' => get_the_title(),
			'polling' => $polling ? intval( $polling ) : 60, // OPTIONAL IN OLDER VERSIONS
			'subscribedPlaylistIds' => $subscribed_playlist_ids,
			'subscribedOverrideIds' => $subscribed_override_ids,
			'overlay' => $overlayPost ? $overlayPost->ID : null
		);
	}
	// DEGUG 9
	if ($futusign_debug === '9') {
		echo 9;
		die();
	}
	if ($screen === null) {
		status_header(404);
		return;
	}
	// DEBUG 10
	if ($futusign_debug === '10') {
		echo 10;
		die();
	}
	wp_reset_query();
	echo json_encode($screen);
}
