tinymce.init({
  selector: 'div.mdl-editor',
  theme: 'inlite',
  language: 'pt_BR',
  entity_encoding : "raw",
  verify_html : false,
  cleanup : false,
  inline: true,
  paste_data_images: true,
  plugins: 'image table link paste contextmenu textpattern autolink preview',
  insert_toolbar: 'quickimage quicktable',
  selection_toolbar: 'bold italic styleselect | quicklink blockquote | alignleft aligncenter alignright alignjustify',
  content_css: [
    '/stylesheets/codepen.min.css',
  ]
});
