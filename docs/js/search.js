$(document).on('click', '.tag-link', function(){
    var tag = $(this).text(); //get the tag we are looking for
    var statement = $(this).attr('data-statement'); //Get the tag group eg. member tags, segment etc
    $('#memberOverlay').modal('hide'); //hide the member overlay


    filterByTag(tag, statement);

    return false;
});

$(document).on('click', '#searchReset', function(){
    $('.cardbox').show('fast');
    $('#searchResponse').hide('fast');
    $('#searchReset').hide('fast');
    $('.searchboxfield').val('');
    return false;
});

/** filterByTag
 * Takes two arguments
 * tag and tagGroup
 */
function filterByTag(tag, tagGroup){

    var $targets = $('.cardbox'); // select all cards
    $targets.show(); // display all cards

    //debugger;
    if (tag) {
        $targets.each(function () {
            //debugger;
            var $target = $(this);
            var matches = 0;
            // Search only in targeted element
            // Search only by tags
            $target.find('.card-'+tagGroup).each(function () { // on a card. Target the card-segment in <p class="card-segment">mobilitet,robotics</p>

                var fields = $(this).text().split(',');

                $.each(fields, function( index, value) {
                    if (value.toLowerCase() == tag.toLowerCase()) {
                        matches++;
                    }
                });

            });

            if (matches == 0) { //If none of the tags contains the tag, then we hide the card
                // fix for _display.scss -> .d-flex {display: flex !important;}
                $target.attr('style','display:none !important');
            }

        });
        updateSearchStatus("Tag", tag);

    }
}




/** filterByOrgType
 *
 */
function filterByOrgType(orgType){

    var orgTypeIcon = getOrgTypeIcon(orgType);

    var $targets = $('.cardbox'); // select all cards
    $targets.show(); // display all cards

    MainMap.activateLayer(orgType_hash[orgType]);
    currentOrg = orgType;

    //debugger;
    if (orgType) {
        $targets.each(function () {
            //debugger;
            var $target = $(this);


            var theOrgType;
            theOrgType = $target.find('.fa.fa-'+ orgTypeIcon);
            //console.log(theOrgType[0]);
            var lengden;
            lengden = theOrgType[0];

                if (lengden == undefined) {
                    $target.attr('style','display:none !important');
                }
        });
        updateSearchStatus("organization", orgType);

    }
}

/*** updateSearchStatus
 * Updates the status line of what has been searched for
 * takes two parameters.
 */

function updateSearchStatus(filtername, filtervalue) {


        $('#searchResponse')
            .show('fast')
            .find('b').text('')
                .append('Filtering by ' + filtername + ' : '+filtervalue);
        $('#searchReset').show('fast');



}
