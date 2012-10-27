(function($){

    var CoolSwitch = function( element, options ){
        this.init( element, options );
    };

    CoolSwitch.prototype = {

        init        : function( element, options ){

            var self = this;

            this.jqEl           = {
                'source'    : $(element),
                'children'  : [],
                'switch'    : {},
                'labels'    : []
            };
            this.currentValue   = '';
            this.currentIndex   = '';
            this.children       = [];
            this.options        = $.extend({}, $.fn.coolSwitch.defaults, options, this.jqEl['source'].data());

            // make sure this is a 'select' element
            if( this.jqEl['source'].is('select') ){
                
                this.jqEl.children = this.jqEl['source'].children('option');

                // initialize only for select with two children
                if( this.jqEl.children.length === 2 ){

                    // store the current value
                    this.currentValue = this.jqEl['source'].val();

                    this.jqEl.children.each(function(i){

                        self.children[i]    = {
                            'index' : i,
                            'value' : $(this).val(),
                            'text'  : $(this).text()
                        };

                        // store the current index
                        if( self.currentValue === self.children[i].value ){
                            self.currentIndex = i;
                        }

                    });

                    // build the replacement element
                    this.build();

                }

            }

        },

        build       : function(){

            var self        = this,
                className   = this.options.className ? ' ' + this.options.className : '',
                html        = this.getHtml();

            // wrap the original select element
            this.jqEl['switch'] = this.jqEl.source.hide().wrap( $('<div/>',{
                'class' : 'coolSwitch-wrapper' + className
            }) ).parent();

            // append the new element to the dom
            $(html).appendTo( self.jqEl['switch'] );

            // store the label elements
            this.jqEl['labels'] = this.jqEl['switch'].find('.coolSwitch-label');

            // save the data on each label elements
            this.jqEl['labels'].each(function(i){
                $(this).data('coolswitch.label', self.children[i] );
            });

            // add event listeners
            this.addEvents();

            this.setValue( this.currentIndex, this.currentValue );

        },

        getHtml     : function(){

            var html        = '';

            html += '<label class="coolSwitch-label">' + this.children[0].text + '</label>';
            html += '<div class="coolSwitch">';
                html += '<span class="coolSwitch-handle"></span>';
            html += '</div>';
            html += '<label class="coolSwitch-label">' + this.children[1].text + '</label>';

            return html;

        },

        doSwitch    : function( index, value ){

            if( value !== this.currentValue ){

                this.setValue( index, value );

            }

        },

        toggle      : function(){

            var index   = ( this.currentIndex === 0 ) ? 1 : 0,
                value   = this.children[ index ].value;
                
            this.doSwitch( index, value );

        },

        setValue    : function( index, value ){

            if( index === 1 ){
                this.jqEl['switch'].addClass('isToggled');
                this.jqEl['labels'].eq(1).addClass('coolSwitch-label-selected');
                this.jqEl['labels'].eq(0).removeClass('coolSwitch-label-selected');
            } else {
                this.jqEl['switch'].removeClass('isToggled');
                this.jqEl['labels'].eq(0).addClass('coolSwitch-label-selected');
                this.jqEl['labels'].eq(1).removeClass('coolSwitch-label-selected');
            }
        
            this.currentValue = value;
            this.currentIndex = index;

            // change the value on the original select element
            this.jqEl['source'].val( value ).trigger('change');

        },

        addEvents   : function(){

            var self    = this;

            this.jqEl['switch'].on('click', '.coolSwitch-label', function(){

                var data = $(this).data('coolswitch.label');

                self.doSwitch( data.index, data.value );

            }).on('click', '.coolSwitch', function(){

                self.toggle();

            });

            // listen for changes on the original select element
            this.jqEl['source'].on('change', function(){

                var value   = self.jqEl['source'].val(),
                    index   = ( self.children[0].value === value ) ? 0 : 1;

                self.doSwitch( index, value );

            });

        }

    };

    $.fn.coolSwitch = function( option ){
        return this.each(function(){
            var jqEl    = $(this),
                data    = jqEl.data('coolswitch'),
                options = typeof option === 'object' && option;
            if(!data){ jqEl.data('coolswitch', (data = new CoolSwitch(this, options))); }
        });
    };
    
    $.fn.coolSwitch.defaults = {
        'className' : ''
    };

}(jQuery));