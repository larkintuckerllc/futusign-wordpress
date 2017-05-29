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
	$images = array();
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
			'file' => get_field('file'),
			'title' => get_the_title(),
			'imageDuration' => intval(get_field('image_duration')),
			'priority' => $priority ? intval($priority) : 1
    );
  }
  wp_reset_query();
	// TODO: REMOVE TEMP PLAYLISTS
	header( 'Content-Type: application/json' );
	header( 'Cache-Control: no-cache, no-store, must-revalidate');
	echo '{';
	echo '"screen": ';
	echo json_encode( $screens[ 0 ]);
	echo ', "images": ';
	echo json_encode( $images );
	echo '}';
}
futusign_endpoint();
