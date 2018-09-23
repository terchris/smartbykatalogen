$(document).on('click', '.tag-link', function(){ 
    var tag = $(this).text();
    var statement = $(this).attr('data-statement');
    $('#memberOverlay').modal('hide');


    var $targets = $('.cardbox'); // 
    $targets.show();

    //debugger;
    if (tag) {
        $targets.each(function () {
            //debugger;
            var $target = $(this);
            var matches = 0;
            // Search only in targeted element
            // Search only by tags
            $target.find('.card-'+statement).each(function () {

                var fields = $(this).text().split(',');

                $.each(fields, function( index, value) {
                    if (value.toLowerCase() == tag.toLowerCase()) {
                        matches++;
                    }
                });

            });

            if (matches == 0) {
                // fix for _display.scss -> .d-flex {display: flex !important;}
                $target.attr('style','display:none !important');
            }
    
        });

        $('#searchResponse')
            .show('fast')
            .find('h4').text('')
                .append('Searching result by tag <strong>'+tag+'</strong>:');
        $('#searchReset').show('fast');  

    }

    return false;
});

$(document).on('click', '#searchReset', function(){
    $('.cardbox').show('fast');
    $('#searchResponse').hide('fast');
    $('#searchReset').hide('fast');
    $('.searchboxfield').val('');
    return false;
});