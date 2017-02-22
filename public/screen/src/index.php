<!DOCTYPE html>
<html lang="en">
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
  <title>futusign Screen</title>
</head>
<body>
  <div id="root" />
  <?php while (have_posts()) : the_post(); ?>
    <script>
      window.publicPath = '<?php echo trailingslashit( plugins_url( '', __FILE__ ) ); ?>';
      window.screenId = <?php echo get_the_ID(); ?>;
    </script>
  <?php endwhile; ?>
  <script src="<?php echo plugins_url( 'vendor.bundle.js', __FILE__ ); ?>"></script>
  <script src="<?php echo plugins_url( 'main.bundle.js', __FILE__ ); ?>"></script>
</body>
</html>
