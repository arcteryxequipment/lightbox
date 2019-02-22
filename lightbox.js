/* eslint-disable */
const Lightbox = function ( elem ) {
  this.trigger = elem;
  this.el = document.querySelector( ".lightbox" );
  this.body = document.querySelector( ".lightbox .body" );
  this.content = document.querySelector( ".lightbox .content" );
  this.height = elem.getAttribute( "lightbox-max-height" ) || "600"; 
  this.width = elem.getAttribute( "lightbox-max-width" ) || "650"; 
  this.type = elem.getAttribute( "lightbox" );
  this.href = elem.getAttribute( "url" ) || elem.getAttribute( "href" );
  this.image = null;
  this.video = null;
  this.init();
};

Lightbox.prototype.init = function () {
  const _this = this;

  if ( ! this.el ) {
    this.create();
  }

  this.trigger.addEventListener( "click", e => {
    e.preventDefault();
    _this.open();
  } );
};

Lightbox.prototype.create = function () {
  const _this = this,
    cl = document.createElement( "div" ), // Close
    bd = document.createElement( "div" ); // Backdrop

  this.el = document.createElement( "div" );
  this.content = document.createElement( "div" );
  this.body = document.createElement( "div" );

  this.el.classList.add( "lightbox" );
  bd.classList.add( "backdrop" );
  cl.classList.add( "close" );
  this.content.classList.add( "content" );
  this.body.classList.add( "body" );

  cl.innerHTML = "<span class=\"fa fa-times\">&times;</span>";

  this.el.appendChild( bd );
  this.content.appendChild( cl );
  this.content.appendChild( this.body );
  this.el.appendChild( this.content );
  document.body.appendChild( this.el );

  cl.addEventListener( "click", () => {
    _this.close();
  } );

  bd.addEventListener( "click", () => {
    _this.close();
  } );

  const f = function ( e ) {
    if ( _this.isOpen() ) {
      return;
    }
    _this.el.classList.remove( "show" );
    _this.body.innerHTML = "";
  };

  this.el.addEventListener( "transitionend", f, false );
  this.el.addEventListener( "webkitTransitionEnd", f, false );
  this.el.addEventListener( "mozTransitionEnd", f, false );
  this.el.addEventListener( "msTransitionEnd", f, false );
};

Lightbox.prototype.loadImage = function () {
  const _this = this;

  this.setDimensions( this.width, this.height );

  if ( ! this.image ) {
    this.image = new Image();

    this.image.addEventListener( "load", function () {
      const dim = _this.fitToSize( this.naturalWidth, this.naturalHeight, _this.width, _this.height );
      _this.setDimensions( dim.width, dim.height );
    } );

    this.image.src = this.href;
  }

  this.body.appendChild( this.image );
};

Lightbox.prototype.loadVideo = function () {
  const _this = this;
  this.setDimensions( this.width, this.height );

  if ( ! this.video ) {
    this.video = document.createElement( "video" );
    this.video.addEventListener( "loadedmetadata", function () {
      const dim = _this.fitToSize( this.videoWidth, this.videoHeight, _this.width, _this.height );
      _this.setDimensions( dim.width, dim.height );
    } );
    this.video.src = this.href;
    this.video.autoplay = true;
    this.video.controls = true;
  }

  this.body.appendChild( this.video );
};

Lightbox.prototype.loadIframe = function () {
  this.setDimensions( this.width, this.height );
  this.body.innerHTML = `<iframe src="${ this.href }" frameborder="0" allowfullscreen scrolling="no"></iframe>`;
};

Lightbox.prototype.open = function () {
  switch ( this.type ) {
    case "image":
      this.loadImage();
      break;
    case "video":
      this.loadVideo();
      break;
    default:
      this.loadIframe();
  }

  this.el.classList.add( "show" );
  this.el.offsetHeight; // Force render
  this.el.classList.add( "open" );
};

Lightbox.prototype.close = function () {
  this.el.classList.remove( "open" );
};

Lightbox.prototype.isOpen = function () {
  return this.el.classList.contains( "open" );
};

Lightbox.prototype.setDimensions = function ( w, h ) {
  this.width = w;
  this.height = h;
  this.content.style.maxWidth = `${w }px`;
  this.content.style.maxHeight = `${h }px`;
};

Lightbox.prototype.fitToSize = function ( w, h, maxW, maxH ) {
  const r = h / w;

  if ( w >= maxW && r <= 1 ) {
    w = maxW;
    h = w * r;
  } else if ( h >= maxH ) {
    h = maxH;
    w = h / r;
  }

  return {
    "width": w,
    "height": h,
  };
};

export default Lightbox;
