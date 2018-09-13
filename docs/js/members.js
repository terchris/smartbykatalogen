
/**  tags Displays all tags on a organization as list items
 *   statment uses for search field
 * 
 */
function tags(tags, statement) {
    return `
    ${tags.map(tag => ` <li><a href="#" class="tag-link" data-statement="${statement}">${tag.trim()}</a></li> `).join("")}
`;
}

/* Writes text to a div - used for logging 
Se global variable to false to stop logging or just remove the divTag*/
function mylog(divTag, logTxt) {
    if (globalMyLog) {
        var element = document.getElementById(divTag);
        document.getElementById(divTag).innerText = element.innerText + logTxt + " :--  ";
    }
}


/* Test if a string is a valid json string */
function isJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}



/* Inserts the search box */
function displaySearchbox(noMembers) {
    debugger;
    return `
    <div class="jumbotron jumbotron-fluid">
    <div class="container">
        <h1 class="display-3">Smarte Byer Norge - Nettverket</h1>
        <p class="lead">
            Smarte Byer Norge nettverket er i første rekke et uformelt nettverk der alle aktører som er interessert i smartbyutvikling
            kan finne hverandre, møtes på nøytral grunn, diskutere, dele erfaringer og bistå hverandre.
    </div>
</div>




<div>
    REMOVE THIS Logging:
    <p id="mylogdiv"></p>
</div>






`;
}


/**
    * The user.about field is free txt. This code figures out how to read it.
    * If the field is empty. Well then its empty and we do nothing
    * if it contains text. Then we display the text (no test for lenght)
    * if it is a json string we try to get the fields
    * The user.about json looks like this { "title":"Boss", "aboutdisplay":"Self made man and genius", "profilepictureurl":"http://icons.iconarchive.com/icons/designbolts/free-male-avatars/128/Male-Avatar-Bowler-Hat-icon.png", "phone":"90054123", "email":"jalmar@jalla.no"}
 */
function getExtendedUserProperties(user) {


    user.userProfileURL = ckanServer + "user/" + user.name; //Set the URL you go to when clicking on the user
    user.profilepictureurl = ""; // assume no picture



    if ($.isEmptyObject(user.about)) {
        user.aboutdisplay = ""; // about field is empty - don't display anything about the user
    } else if (isJson(user.about)) {
        // the about field contains a json string
        var userAboutObj = JSON.parse(user.about);
        for (var i in userAboutObj) {
            user[i] = userAboutObj[i]; // copy the attributes. whatever they may be
        }
        if (user.title != "") {
            user.aboutdisplay = user.title; // Display the tilte if there is one
        }

    } else {
        user.aboutdisplay = user.about; // there is some text there. Assume we can just display it
    }


    return user;
}





/**
 *  Figuring out what icon to symbolize organisation type
 * Icon set https://linearicons.com/free
*/
function orgType(orgType) {

    const researchIcon = 'graduation-cap';
    const publicIcon = 'institution';
    const startupIcon = 'rocket';
    const privateIcon = 'industry';
    const civilSocietyIcon = 'group';
    const defaultIcon = 'support';

    var icon = '';
    var orgTypeDisplayTxt = '';
    /* The case values here must correspond with the names in the extended schema for urbalurba*/
    switch (orgType) {
        case 'research':
            icon = researchIcon;
            orgTypeDisplayTxt = 'FoU';
            break;
        case 'public':
            icon = publicIcon;
            orgTypeDisplayTxt = 'Offentlig';
            break;
        case 'startup':
            icon = startupIcon;
            orgTypeDisplayTxt = 'Startup';
            break;
        case 'private':
            icon = privateIcon;
            orgTypeDisplayTxt = 'Privat';
            break;
        case 'civil_society':
            icon = civilSocietyIcon;
            orgTypeDisplayTxt = 'Sivilsamfunn';
            break;

        default:
            icon = defaultIcon;
    }

    return `<i class="fa fa-${icon} fa-sm" data-toggle="tooltip" data-placement="top" title="${orgTypeDisplayTxt}"></i>`;
}



/**
 * editMemberTags
 */
function editMemberTags(member_id, fieldToEdit, leadTxt) {
    var member = globalMembers.find(function (member) { return member.id === member_id; }); //get the member object

    debugger;

    if (myAPIkey.length == "") { //not logged in
        alert("not logged in");


    } else {
        //TODO: check that the myAPIkey has rights to update

        var currentFieldValue = member[fieldToEdit];


        document.getElementById("myEditModal").innerHTML = `
        <div class="modal-dialog" role="document">
            <div id="myEditModalContent">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="myEditModalLabel">Edit ${leadTxt}: ${member.display_name}</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <form>
                            <div class="form-group">
                                <label for="tags">Tags</label>
                                <input type="text" value="${currentFieldValue}" class="form-control" id="editTags" placeholder="komma, separert, liste">
                                <span class="help-block">Tags gjør din virksomhet søkbar. Kommaseparert liste</span>
                            </div>


                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        <button type="button" onclick="saveMemberTags('${member.id}','${fieldToEdit}')" class="btn btn-primary">Save changes</button>
                    </div>
                </div>
            </div>
        </div>
        `;
        $('#myEditModal').modal('show');
    }

}

/**
 * saveMemberTags
 */
function saveMemberTags(member_id, fieldToEdit) {
    debugger;
    isOK = 2;
    var newTags = document.getElementById("editTags").value;
    isOK = orgUpdateField(member_id, fieldToEdit, newTags);
    if (isOK == 1) {
        debugger;

    }
    $('#myEditModal').modal('hide')
}



/**
 * displays the profile images for each user
 * NOT USED
 */
function displayUserAvatars(users) {

    return `
            <!-- Start avatars -->
            <div class="avatars-stack mt-2">

                ${users.map(users => ` 
                <div class="avatar">
                <a href="${users.userProfileURL}" data-toggle="tooltip" data-placement="top" title="${users.display_name} ${users.aboutdisplay}">
                    <img class="img-avatar" src="${users.profilepictureurl}" onerror="this.onerror=null;this.src='${avatarImageDefaut}';">
                    </a>
                </div>  
            `).join("")}
            </div>     
            <!-- stop avatars --> 
`;
}

/** displayMemberContactInfo
 * 
 * 
 */
function displayMemberContactInfo(member) {

    return `

    <!-- START org info-->
    <div class="list-group">

        <div class="list-group-item">
            <small class="text-muted mr-3">
                <i class="icon-location-pin"></i>  ${member.main_adddress}</small>
        </div>

        <div class="list-group-item">
            <small class="text-muted mr-3">
                <i class="icon-phone"></i>  ${member.phone}</small>
        </div>

        <div class="list-group-item">
            <small class="text-muted mr-3">
                <i class="icon-globe"></i>  ${member.website}</small>
        </div>

        <div class="list-group-item">
            <small class="text-muted mr-3">
                <i class="icon-user"></i>  ${member.contact_name}</small>
        </div>

        <div class="list-group-item">
            <small class="text-muted mr-3">
            ${member.organization_type ? orgType(member.organization_type) : '<i class="fa fa-industry"></i>'} ${member.organization_type}</small>
        </div>

        <div class="list-group-item">
            <small class="text-muted mr-3">
                <i class="icon-check"></i>  SBN medlem: ${member.member}</small>
            <small class="text-muted mr-3">
                <i class="icon-badge"></i>  SBN Prime medlem</small>
        </div>

    </div>
    <!-- SLUTT org info-->





    `;
}



/** displayMemberProfileCard
 * Takes member object as parameter and creates a card with member info
 * NOT USED
 */
function displayMemberProfileCard(member) {

    return `
    <div class="card">

    
    <img class="card-img-top img-fluid" src="${member.image_display_url}" onerror="this.onerror=null;this.src='${organizationImageDefaut}';" alt="${member.display_name}">    


    <div class="card-body">
        <h4 class="card-title">${member.display_name}
            ${member.organization_type ? orgType(member.organization_type) : ""} 
        </h4>
        <h6 class="card-subtitle mb-2 text-muted">${member.slogan}</h6>

        ${displayMemberContactInfo(member)}

    </div>
</div>

`;

}

/** displayMemberTagsCard
 * Takes member object as parameter and creates a card with tags info
 * NOT USED
 */
function displayMemberTagsCard(member) {

    return `
    <div class="card">
        <div class="card-header">
            Tags
        </div>
        <div class="card-body">
            <ul>
                ${member.tags ? tags(member.tags) : ""}
            </ul>    
        </div>
    </div>
    `;

}

/** displayMemberDescriptionCard
 * Takes member object as parameter and creates a card with about info
 * NOT USED
 */
function displayMemberDescriptionCard(member) {

    return `
    <div class="card">
        <div class="card-header">
            Om
        </div>
        <div class="card-body">
            <div class="list-group">
                <div class="list-group-item">            
                    ${member.description}
                </div>
            </div>
        </div>
    </div>
    `;

}



/**
 * Template for displaying an article inside a card
 * 
 */
function articleTemplateCard(article) {

    return `
    <div>

        <div class="card">
            <div class="card-header">
                ${article.what}
            </div>
            <div class="card-body">
                ${article.text}
            </div>
            <div class="card-footer">
                <small>
                    <i class="icon-user"></i>
                    ${article.who}
                </small>
                <small>
                    <i class="icon-home"></i>
                    ${article.virksomhet}
                </small>
            </div>

        </div>

    </div>

    `;

}

/**
 * Displays all articles that are linked to a member
 * The link (id) is the member.name on the arganization
 * 
 */
function displayArticles(member) {

    var memberArticles = globalSBNnetworkInfo.filter(function (matchingMember) {
        return matchingMember.name == member.name;
    });
    return `
    <div class="container">
        <div class="row">
            ${memberArticles.map(articleTemplateCard).join("")}       
        </div>        
    </div>
    
    `;

}



/**
 * Read all articles in the dataset id SBNnetworkInfo_resource_id into the array globalSBNnetworkInfo
 *  If the articles are already in the globalSBNnetworkInfo array. Then the articles are displayed 
 */
function readSBNnetworkInfo(member) {

    if (Array.isArray(globalSBNnetworkInfo)) { // the array is already read
        return `
            ${displayArticles(member)} 
            `;
    } else {
        // First call. Read it from server
        var client = new CKAN.Client(ckanServer, myAPIkey);

        client.action('datastore_search', { resource_id: SBNnetworkInfo_resource_id },
            function (err, result) {
                if (err != null) { //some error - try figure out what

                    mylog(mylogdiv, "SBNnetworkInfo_resource_id:" + SBNnetworkInfo_resource_id + "  ERROR: " + JSON.stringify(err));
                    console.log("SBNnetworkInfo_resource_id:" + SBNnetworkInfo_resource_id + "  ERROR: " + JSON.stringify(err));
                } else // we have read the resource     
                {
                    globalSBNnetworkInfo = result.result.records;
                    document.getElementById("SBNnetworkInfo_resource_id").innerHTML = `
                        ${displayArticles(member)} 
                    `;
                }

            });

    }
}



/**
 * displays the card for a organization
 * Thisis the main listing of members.
 *
 */

function memberTemplateCard(member) {
    return `
        <div class="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-4 d-flex cardbox" onclick="displayMemberOverlay('${member.id}')">
            <div class="urbacard card card-body flex-fill card-accent-secondary mb-2">
                <div class="row" style="margin: 0">
                <div class="media text-center" style="width: 100%;">
                    <img class="align-self-center mr-2" src="${member.image_display_url}" 
                    onerror="this.onerror=null;this.src='${organizationImageDefaut}';" alt="${member.display_name}">
                    <div class="media-body">
                        <h5 class="mt-0 mb-0">${member.display_name}</h5>
                        <p class="mt-0" card-subtitle text-muted">${member.slogan}</p>
                        <div class="collapse" id="collapse-${member.name}">
                            <p class="card-text">${member.description}</p>
                            <p class="card-member-tags">${member.member_tags}</p>
                            <p class="card-member-tags">${member.segment}</p>
                            <p class="card-development-goals">${member.sustainable_development_goals}</p>
                            <p class="card-member-tags">${member.insightly_tags}</p>
                        </div>
                        <div class="card-tags mt-2">
                            ${member.organization_type ? orgType(member.organization_type) : ""}
                            ${member.description.length > 50 ? ` <i class="icon-info"></i> ` : ""}
                            ${member.phone ? ` <i class="icon-phone"></i> ` : ""}
                            ${ ((isValidResource(member.employees)) || (Array.isArray(member.employees))) ? ` <i class="icon-people"></i> ` : ""}
                            ${member.member_tags ? ` <i class="icon-tag"></i> ` : ""}              
                            ${member.package_count > 0 ? ` <i class="fa fa-database"></i> ` : ""}   
                        </div> 
                    </div>
               
                    <!--div class="col-xl-6 col-lg-12 col-md-12 col-sm-3 text-center">
                        <img class="img-fluid" src="${member.image_display_url}" onerror="this.onerror=null;this.src='${organizationImageDefaut}';" alt="${member.display_name}">
                    </div>
                    <div class="col-xl-6 col-lg-12 col-md-12 col-sm-9">
                        <h5 class="card-title">${member.display_name}</h5>              
                        <h6 class="card-subtitle mb-2 text-muted">${member.slogan}</h6>
                        <div class="collapse" id="collapse-${member.name}">
                            <p class="card-text">${member.description}</p>
                            <p class="card-member-tags">${member.member_tags}</p>
                            <p class="card-segment">${member.segment}</p>
                            <p class="card-development-goals">${member.sustainable_development_goals}</p>
                            <p class="card-insightly-tags">${member.insightly_tags}</p>
                        </div>

                    <div class="card-tags mt-4">
                        ${member.organization_type ? orgType(member.organization_type) : ""}
                        ${member.description.length > 50 ? ` <i class="icon-info"></i> ` : ""}
                        ${member.phone ? ` <i class="icon-phone"></i> ` : ""}
                        ${ ((isValidResource(member.employees)) || (Array.isArray(member.employees))) ? ` <i class="icon-people"></i> ` : ""}
                        ${member.member_tags ? ` <i class="icon-tag"></i> ` : ""}              
                        ${member.package_count > 0 ? ` <i class="fa fa-database"></i> ` : ""}   
                     </div--> 
                    </div>
                </div>
            </div>
        </div>
    <!-- end card -->
    `;
    //</div>
}



/* Connects the search to the searchbox 
* The must class must exist <input type="text" class="searchboxfield" placeholder="Search..." />
* and must be loaded and ready before this function executes
* The search is quite nifty. A target is set on the div that we want to seatch in.
* the name of the target is urbacard
* Important. In order not just hide, but also reorganize the output on the screen, 
* the target must be set on the outer div that is to be removed.
*     <div class="col-sm-6 col-md-4 urbacard"> 
*       <div class="card">
*
* */

function searching() {
    $('.searchboxfield').on('input', function () { // connect to the div named searchboxfield
        $('#searchResponse').find('h4').text('')
        var $targets = $('.cardbox'); // 
        $targets.show();
        //debugger;
        var text = $(this).val().toLowerCase();
        
        if (text) {
            $('#searchReset').show('fast');
            $targets.each(function () {
                var $target = $(this);
                var matches = 0;
                // Search only in targeted element
                $target.find('h2, h3, h4, h5, h6, p.card-text').each(function () {
                    if ($(this).text().toLowerCase().indexOf("" + text + "") !== -1) {
                        matches++;
                    }
                });

                if (matches == 0) {
                    // $target.hide();
                    // fix for _display.scss -> .d-flex {display: flex !important;}
                    $target.attr('style','display:none !important')
                }
            });

            $overall = $targets.filter(':visible').length;
            if($overall === 0){
                $('#searchResponse')
                .show('fast')
                .find('h4').text('')
                    .append('No search results found');
            }

        } else {
            $('#searchReset').hide('fast');  
        }
        
    });

}



/* Test if a user is an admin */
function isAdminUser(name) {
    // Check if a user is in the lis of admins that should not be displayed
    // return true if the user is an admin

    isAdminUserReturn = false;
    for (var i = 0; i <= adminUsersToRemove.length; i++) {
        if (adminUsersToRemove[i] == name) {
            isAdminUserReturn = true;
            break;
        }

    }
    return isAdminUserReturn;
}



/** employeeTemplateSidebar
 * Used to display employees in sidebar
 */
function employeeTemplateSidebar(employee) {

    return `    
    <!-- start employee -->
    <div class="list-group-item list-group-item-divider">
        <div class="avatar float-right">
            <img class="rounded-circle img-fluid d-block mx-auto" src="${employee.profilbilde}" onerror="this.onerror=null;this.src='${avatarImageDefaut}';" >
        </div>
        <div>
            <strong>${employee.fornavn} ${employee.etternavn}</strong>
        </div>
        <div>${employee.tittel}</div>
        <div>
            <small class="text-muted mr-3">
                <i class="icon-screen-smartphone"></i> <a href="tel:${employee.mobil}"> ${employee.mobil}
            </small>
    
            ${(employee.linkedin.length > 10) ? '<a href="${employee.twitter}" target="_blank"><small class="text-muted"><i class="icon-social-linkedin"></i></small></a> ' : ""}

            ${(employee.twitter.length > 10) ? '<a href="${employee.twitter}" target="_blank"><small class="text-muted"><i class="icon-social-twitter"></i></small></a> ' : ""}

        </div>

        <small class="text-muted">
            <i class="icon-envelope"></i>  ${employee.epost}
        </small>
    </div>
<!-- end employee -->
 `;




}

/** employeeTemplateRow Displays employees in a row 
 * NOT USED
 */
function employeeTemplateRow(employee) {


    return `
    <!-- start employee -->
    <div class="col-lg-4 col-sm-6 text-center mb-4">    
        <img class="rounded-circle img-fluid d-block mx-auto" src="${employee.profilbilde}" onerror="this.onerror=null;this.src='${avatarImageDefaut}';" >
        <h3>${employee.fornavn} ${employee.etternavn}
            <small>${employee.tittel}</small>
        </h3>
        <div>
            <small class="text-muted">
                <i class="icon-envelope"></i>  ${employee.epost}
            </small>
            <small class="text-muted mr-3">
                <i class="icon-screen-smartphone"></i> <a href="tel:${employee.mobil}"> ${employee.mobil}
            </small>
        </div>

        
        <a href="${employee.linkedin}" target="_blank">
            <small class="text-muted mr-3">
                <i class="icon-social-linkedin"></i>
            </small>
        </a>

        <a href="${employee.twitter}" target="_blank">
            <small class="text-muted">
                <i class="icon-social-twitter"></i>
            </small>
        </a>      
    </div>
  <!-- end employee -->
    `;


}


/** displayEmployeesSidebar
 * 
 */
function displayEmployeesSidebar(member) {


    return `
    <!-- start employees -->
    <div class="list-group">
        ${member.employees.map(employeeTemplateSidebar).join("")}         
    </div>
  <!-- end employees -->
    `;


}

/*** displays all employees for a member.
 * NOT USED
 */

function displayEmployeesRow(member) {

    return `
    <!-- start employees -->
    <div class="row">
        <div class="col-lg-12">
        <h2 class="my-4">Team</h2>
        </div>
        ${member.employees.map(employeeTemplateRow).join("")}
         
    </div>
  <!-- end employees -->
    `;
}



/** readEmployees reads all employees for the organisation
 * and adds it to the member object in the global array
 * the field member.employee_resource_id can contain a resource_id for the dataset that contains the employees 
 * If the member.employee_resource_id contains a valid resource id and it can be read then 
 * the employees are read into the member.employees array
 * 
 * If this function has run before for the organisation, then the member.employees contains a array of all emplyees
 */
function readEmployees(member) {

    if (member.hasOwnProperty('employees')) {   // if the field employees is present. 
        if (Array.isArray(member.employees)) { // employees are already read into member object
            // when the employees are already in the array we can just output them
            return `
                ${displayEmployeesSidebar(member)} 
            `;
        }
    } else // employees are not read
        if (member.hasOwnProperty('employee_resource_id')) { // there is a property
            if (isValidResource(member.employee_resource_id)) { // and the member has a valid pointer to a dataset resource

                var client = new CKAN.Client(ckanServer, myAPIkey);

                client.action('datastore_search', { resource_id: member.employee_resource_id },
                    function (err, result) {

                        if (err != null) { //some error - try figure out what
                            debugger;
                            mylog(mylogdiv, "readEmployees ERROR: " + JSON.stringify(err));
                            console.log("readEmployees ERROR: " + JSON.stringify(err));
                        } else // we have read the resource
                        {
                            member.employees = JSON.parse(JSON.stringify(result.result.records));     // copy the employees array to the member 
                            // we must attach to the div id employees the first time because it has taken time to fetch the employees
                            document.getElementById("employees").innerHTML = `
                                ${displayEmployeesSidebar(member)} 
                            `;

                        }

                    });
            } else
                if (member.employee_resource_id != "") //No valid resource id
                    return `Kontaktpersoner ikke definert. [ugyldig id]`;
                else
                    return `Kontaktpersoner ikke definert.`;

        }
        else
            return `Kontaktpersoner ikke definert. `;
}







/*** Test if a resurce_id is valid.
* A valid resource_id is llike this:
* 88ad7fac-f90c-4ae2-ba01-bcceb1486137
* Lenght = 36 
*****/
function isValidResource(resource_id) {

    //TODO: write the code to validate the resource_id
    if (resource_id != undefined) {
        var n = resource_id.length;
        if (n == 36)
            return true;
        else
            return false;
    }
}


/*** tagsToArray
 * takes a string that is comma separated and returns an array of the strings
 * clean out empty tags like ,, and leading/ending spaces
 * return "" if there is no array in the tagString
 */
function tagsToArray(tagString) {
    if ((tagString != undefined) && (tagString != "")) {
        var newArray = [];
        var tagArray = tagString.split(','); // create an array
        for (var i = 0; i < tagArray.length; i++) {
            tmpTag = tagArray[i].trim();
            tmpTag = tmpTag.toLowerCase();
            if (tmpTag != "") newArray.push(tmpTag);
        }
        return newArray;
    } else
        return "";
}

function tidyOrganizations(members) {
    // Remove the organizations that are not "member": "yes",
    // Remove the ckan admin user from the list of users in the organization
    // call setUserProperties to figure out how to intepret the user.about field
    // creates array of the comma separated tag fields


    newMemberArray = []; // All members are copied into this array.


    for (var i = 0; i < members.length; i++) {    //loop members
        //        if (members[i].member == 'yes') {  // we want only those marked member

        newMember = JSON.parse(JSON.stringify(members[i])); // copy the full member object



        // handle the ckan users for the member org 
        originalNumUsers = newMember.users.length; // count the original number
        delete newMember.users;  //delete the users
        let newUserArray = []; // we will copy all user that are not admin into this array

        for (var usrcount = 0; usrcount < originalNumUsers; usrcount++) { // loop users

            if (isAdminUser(members[i].users[usrcount].name)) {
                mylog(mylogdiv, "Admin user removed from : " + members[i].name) // not copied the admin user

            } else {
                theUser = getExtendedUserProperties(members[i].users[usrcount]); // set the properties for the user           
                newUserArray.push(theUser);            // and add it to the new list of users belonging to the org
            }
        }
        newMember.users = JSON.parse(JSON.stringify(newUserArray)); // seems to be the way one copies an array in javascript

        newMember.member_tags = tagsToArray(newMember.member_tags); // convert to array and clean 
        newMember.segment = tagsToArray(newMember.segment); // convert to array and clean 
        newMember.insightly_tags = tagsToArray(newMember.insightly_tags); // convert to array and clean 
        newMember.sustainable_development_goals = tagsToArray(newMember.sustainable_development_goals); // convert to array and clean 

        newMemberArray.push(newMember); // copy the organization. it is a member
        //        } else {
        //            // organization from result set in CKAN is not a member
        //            mylog(mylogdiv,"Not a member" + members[i].display_name);
        //        }

    }

    return newMemberArray;

}



/** getMembersDummyData
 * To avoid waiting for ckan server to return all members we just populate 
 * the screen with the first n member cards
 * 
 * The global array that holds members is globalMembers 
 */
function getMembersDummyData() {

    globalMembers = [
        {
            "package_count": 0,
            "num_followers": 0,
            "contact_name": "",
            "id": "ee3a213d-5836-4f72-ae77-8ef5d4472503",
            "display_name": "abb",
            "approval_status": "approved",
            "title": "",
            "member": "no",
            "state": "active",
            "is_organization": true,
            "type": "organization",
            "website": "http://www.abb.no",
            "description": " El-produkter, roboter og drivsystemer, industriell automatisering og kraftnett.",
            "main_adddress": "",
            "slogan": "Industriell automatisering",
            "name": "abb",
            "created": "2018-04-17T22:57:13.282926",
            "organization_type": "private",
            "employees": "",
            "image_display_url": "http://bucket.urbalurba.com/logo/abb.jpg",
            "insightly_tags": "Hurtigruten2018",
            "image_url": "http://bucket.urbalurba.com/logo/abb.jpg",
            "revision_id": "83b01469-3f20-412c-9f36-4e88db5e57be",
            "insightly_id": "107445495",
            "users": [
                {
                    "email_hash": "590c06df50b74f292f2258d1e64f323e",
                    "about": null,
                    "capacity": "admin",
                    "name": "urbalurbaadmin",
                    "created": "2018-04-14T00:11:07.970227",
                    "openid": null,
                    "sysadmin": true,
                    "activity_streams_email_notifications": false,
                    "state": "active",
                    "number_of_edits": 330,
                    "display_name": "urbalurbaadmin",
                    "fullname": null,
                    "id": "55f915f3-510e-4ab6-bdfb-fd8f0e6437a9",
                    "number_created_packages": 3,
                    "userProfileURL": "http://data.urbalurba.com/user/urbalurbaadmin",
                    "profilepictureurl": "",
                    "aboutdisplay": ""
                }
            ]
        },
        {
            "package_count": 0,
            "num_followers": 0,
            "contact_name": "",
            "id": "a27f3c27-11ef-4f04-921f-629fb58a9799",
            "display_name": "ABAX AS",
            "approval_status": "approved",
            "title": "ABAX AS",
            "member": "no",
            "state": "active",
            "is_organization": true,
            "type": "organization",
            "website": "https://www.abax.no/",
            "description": "Elektronisk kjørebok, utstyrskontroll og digital prosjektstyring",
            "main_adddress": "",
            "slogan": "Elektronisk kjørebok",
            "name": "abax-as",
            "created": "2018-04-17T22:41:34.215029",
            "organization_type": "private",
            "employees": "",
            "image_display_url": "http://bucket.urbalurba.com/logo/abax.jpg",
            "insightly_tags": "Hurtigruten2018",
            "image_url": "http://bucket.urbalurba.com/logo/abax.jpg",
            "revision_id": "a69fdd01-a464-4093-96e2-1737772eea7b",
            "insightly_id": "98965342",
            "users": [
                {
                    "email_hash": "590c06df50b74f292f2258d1e64f323e",
                    "about": null,
                    "capacity": "admin",
                    "name": "urbalurbaadmin",
                    "created": "2018-04-14T00:11:07.970227",
                    "openid": null,
                    "sysadmin": true,
                    "activity_streams_email_notifications": false,
                    "state": "active",
                    "number_of_edits": 330,
                    "display_name": "urbalurbaadmin",
                    "fullname": null,
                    "id": "55f915f3-510e-4ab6-bdfb-fd8f0e6437a9",
                    "number_created_packages": 3,
                    "userProfileURL": "http://data.urbalurba.com/user/urbalurbaadmin",
                    "profilepictureurl": "",
                    "aboutdisplay": ""
                }
            ]
        },
        {
            "package_count": 2,
            "num_followers": 0,
            "contact_name": "Dan Vigeland",
            "id": "5b60c765-ad61-4e9e-876d-5a19653a846b",
            "display_name": "Acando:)",
            "approval_status": "approved",
            "is_organization": true,
            "member": "yes",
            "state": "active",
            "type": "organization",
            "website": "https://www.acando.no/",
            "description": "Acando er et konsulentselskap som jobber med digitale transformasjoner i offentlig og private virksomheter. Teknologi er en sentral driver til forandring, men det er brukerens evne og ønske om å ta teknologien i bruk som skaper verdi. Med teknisk spisskompetanse og inngående innsikt i brukeratferd og forretningsutvikling drevet av digitalisering, skaper vi idéer, løsninger og mobiliserer organisasjoner til forandring.\r\nEt av våre satsningsområder er Smart City der Intelligente Transportsystemer (ITS) og selvkjørende minibusser i alminnelig trafikkmiljø, er en del av satsningen.",
            "main_adddress": "Tordenskioldsgate 8-10, 0160 Oslo",
            "phone": "93001000",
            "organization_number": "979191138",
            "slogan": "Digitalt konsulentselskap",
            "name": "acando",
            "created": "2018-04-16T19:18:33.457075",
            "organization_type": "private",
            "employees": "2dfb69b8-a9cc-47f2-a894-803001703737",
            "image_display_url": "http://bucket.urbalurba.com/logo/acando.jpg",
            "insightly_tags": "",
            "tags": "Selvkjørende, autonom, smart transport, smart mobility, buss,banan",
            "image_url": "http://bucket.urbalurba.com/logo/acando.jpg",
            "title": "Acando",
            "revision_id": "284d8271-bdeb-4173-9169-acf505ca856c",
            "insightly_id": "95288967",
            "users": [
                {
                    "email_hash": "590c06df50b74f292f2258d1e64f323e",
                    "about": null,
                    "capacity": "admin",
                    "name": "urbalurbaadmin",
                    "created": "2018-04-14T00:11:07.970227",
                    "openid": null,
                    "sysadmin": true,
                    "activity_streams_email_notifications": false,
                    "state": "active",
                    "number_of_edits": 330,
                    "display_name": "urbalurbaadmin",
                    "fullname": null,
                    "id": "55f915f3-510e-4ab6-bdfb-fd8f0e6437a9",
                    "number_created_packages": 3,
                    "userProfileURL": "http://data.urbalurba.com/user/urbalurbaadmin",
                    "profilepictureurl": "",
                    "aboutdisplay": ""
                }
            ]
        },
        {
            "website": "http://www.afconsult.com/",
            "display_name": "ÅF Lighting Norge",
            "description": "Rådgivning, offentlig belysning",
            "image_display_url": "http://bucket.urbalurba.com/logo/af-logo-tag-black.jpg",
            "organization_type": "startup",
            "created": "2018-04-18T01:22:38.620441",
            "name": "af-lighting-norge",
            "member": "yes",
            "is_organization": true,
            "state": "active",
            "image_url": "http://bucket.urbalurba.com/logo/af-logo-tag-black.jpg",
            "title": "ÅF Lighting Norge",
            "type": "organization",
            "package_count": 0,
            "slogan": "Rådgivning, offentlig belysning",
            "revision_id": "7b021d2e-5b70-4d16-91aa-9bb6ca7832f4",
            "insightly_id": "114887093",
            "num_followers": 0,
            "id": "a5e05ae1-dbe8-4579-95ec-9aec292dcce3",
            "approval_status": "approved",
            "users": [
                {
                    "email_hash": "590c06df50b74f292f2258d1e64f323e",
                    "about": null,
                    "capacity": "admin",
                    "name": "urbalurbaadmin",
                    "created": "2018-04-14T00:11:07.970227",
                    "openid": null,
                    "sysadmin": true,
                    "activity_streams_email_notifications": false,
                    "state": "active",
                    "number_of_edits": 330,
                    "display_name": "urbalurbaadmin",
                    "fullname": null,
                    "id": "55f915f3-510e-4ab6-bdfb-fd8f0e6437a9",
                    "number_created_packages": 3,
                    "userProfileURL": "http://data.urbalurba.com/user/urbalurbaadmin",
                    "profilepictureurl": "",
                    "aboutdisplay": ""
                }
            ]
        },
        {
            "package_count": 0,
            "num_followers": 0,
            "contact_name": "Gjermund Lanestedt",
            "id": "ba175754-a1b9-4e9f-9e31-f7f7268baa2b",
            "display_name": "Agenda Kaupang",
            "approval_status": "approved",
            "is_organization": true,
            "member": "yes",
            "state": "active",
            "type": "organization",
            "website": "https://www.agendakaupang.no/",
            "description": "Agenda Kaupang er et norsk konsulentselskap. Vi tilbyr analyse, utredning og rådgiving innen områdene ledelse, styring, økonomi og organisasjonsutvikling. Agenda Kaupangs kunder er primært i offentlig sektor, samt blant bedrifter og organisasjoner i arbeidslivet.",
            "main_adddress": "Holtet 45, 1368 Stabekk",
            "phone": "95195648",
            "organization_number": "968938525",
            "slogan": "Rådgivere for offentlig sektor",
            "name": "agenda-kaupang",
            "created": "2018-04-16T19:30:53.207288",
            "organization_type": "private",
            "employees": "",
            "image_display_url": "http://bucket.urbalurba.com/logo/agenda.jpg",
            "insightly_tags": "",
            "image_url": "http://bucket.urbalurba.com/logo/agenda.jpg",
            "title": "Agenda Kaupang",
            "revision_id": "1dc171bd-cbf1-4312-b31c-d3f706e49820",
            "insightly_id": "90622205",
            "users": [
                {
                    "email_hash": "590c06df50b74f292f2258d1e64f323e",
                    "about": null,
                    "capacity": "admin",
                    "name": "urbalurbaadmin",
                    "created": "2018-04-14T00:11:07.970227",
                    "openid": null,
                    "sysadmin": true,
                    "activity_streams_email_notifications": false,
                    "state": "active",
                    "number_of_edits": 330,
                    "display_name": "urbalurbaadmin",
                    "fullname": null,
                    "id": "55f915f3-510e-4ab6-bdfb-fd8f0e6437a9",
                    "number_created_packages": 3,
                    "userProfileURL": "http://data.urbalurba.com/user/urbalurbaadmin",
                    "profilepictureurl": "",
                    "aboutdisplay": ""
                }
            ]
        },
        {
            "package_count": 0,
            "num_followers": 0,
            "contact_name": "",
            "id": "0c6fc289-a443-4e32-9cab-6b59830a8076",
            "display_name": "AISPOT",
            "approval_status": "approved",
            "title": "AISPOT",
            "member": "yes",
            "state": "active",
            "is_organization": true,
            "type": "organization",
            "website": "https://aispot.no/",
            "description": "Aispot helps retail and destinations engage customers and increase loyalty. Enabling the concept of Future Shopping. Clients Simply connect to – and publish to their customers through a shared mobile platform utilizing beacons, QR, club, mobile Wallet and a range of ready-made services",
            "main_adddress": "",
            "slogan": "IoT og app for varehandel og reiseliv",
            "name": "aispot",
            "created": "2018-04-16T20:19:21.829200",
            "organization_type": "private",
            "employees": "",
            "image_display_url": "http://bucket.urbalurba.com/logo/aispot.jpg",
            "insightly_tags": "",
            "image_url": "http://bucket.urbalurba.com/logo/aispot.jpg",
            "revision_id": "08a4b0cf-7f13-4398-82ad-86cf5ec23ecc",
            "insightly_id": "120108147",
            "users": [
                {
                    "email_hash": "590c06df50b74f292f2258d1e64f323e",
                    "about": null,
                    "capacity": "admin",
                    "name": "urbalurbaadmin",
                    "created": "2018-04-14T00:11:07.970227",
                    "openid": null,
                    "sysadmin": true,
                    "activity_streams_email_notifications": false,
                    "state": "active",
                    "number_of_edits": 330,
                    "display_name": "urbalurbaadmin",
                    "fullname": null,
                    "id": "55f915f3-510e-4ab6-bdfb-fd8f0e6437a9",
                    "number_created_packages": 3,
                    "userProfileURL": "http://data.urbalurba.com/user/urbalurbaadmin",
                    "profilepictureurl": "",
                    "aboutdisplay": ""
                }
            ]
        }

    ];





}

/**
 * Log in the user
 */
function doLogin() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    var apikey = document.getElementById("apikey").value;

    /*TODO: call ckan login and get the api-key
    For now we just use the api-key provided */
    //alert("loginform. username:"+ username + " password="+ password + " apikey="+ apikey);
    myAPIkey = apikey;
    loginStatus();
    $('#loginForm').modal('hide')
}





/** displayMemberCards display all members in the 
 * array globalMembers
 * 
 */

/*function displayMemberCards() {

    document.getElementById("app").innerHTML = `
    <!-- start cards -->
    <div class="row">
    ${globalMembers.map(memberTemplateCard).join("")}
    </div>
    </div>
    <!-- End cards -->

    `;

}*/

function displayMemberCards() {

    document.getElementById("app").innerHTML = `
    <!-- start cards -->
    <div class="row">
    ${globalMembers.map(memberTemplateCard).join("")}
    </div>
    <!-- End cards -->

    `;

}

/** displayMemberOverlay displays the info on the member
 * it is called when the user click on a member card
 * takes the member_id as parameter and uses it to find the member to be displayed in the global array globalMembers
 */
function displayMemberOverlay(member_id) {

    var member = globalMembers.find(function (member) { return member.id === member_id; }); //get the member object

    // tracking that we are displaying a member
    analytics.track('Display member', {
        member_id: member_id,
        display_name: member.display_name
      });
    document.getElementById("displayProfile").innerHTML = `

<section>
    <div class="container no-padding">
        <div class="row">
            <div class="col">
                <div class="bg-white text-center">
                            <button type="button" class="close closebtn"  data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>            
                            </button>
                        <img src="${member.image_display_url}" class="img-fluid" onerror="this.onerror=null;this.src='${organizationImageDefaut}';" alt="${member.display_name}">
                </div>
            </div>
        </div>

        
        <div>    
            <div class="jumbotron no-margin" style="border-radius: 0;">
            <div class="row">
                <div class="col text-center">
                <!-- terchris: denne vises på mobil skjerm -->                               
                    <h1 class="display-4">${member.display_name}</h1>
                    <p class="slogan">${member.slogan}</p>
                </div>
            </div>
        </div> 
    </div>
    
</section>

 <div class="container" style="background-color:white">
        
        <!-- start middle section-->
        
        <section class="modal-main-section">

            <div class="container">
         
                <div class="row">
                    <main class="col-md-12 col-lg-12 text-justify">
                        <div>
                            <p class="leadtext">${member.description} </p>
                        </div>
                        <div id="SBNnetworkInfo_resource_id">
                            ${readSBNnetworkInfo(member)}    
                        </div>
                    </main>
                </div>
                <div class="row">
                    <main class="col-sm-12 col-lg-7" >
                        <!-- Start widgets-->
                       
                            <div class="widget widget--widget_meta">
                                <h3 class="widget__title">Kontakt info</h3>
                                ${displayMemberContactInfo(member)} 
                            </div>


                            <div class="widget widget--widget_meta">
                                <h3 class="widget__title">Kontaktpersoner</h3>
                                <div id="employees">
                                    ${readEmployees(member)} 
                                </div>
                            </div>

                        <!-- Stop widgets-->
                    </main>
                    <main class="col-sm-12 col-lg-5">
                        <div class="widgets-NODEFINE">


                        <div class="widget widget--widget_meta">
                            
                            <h3 class="widget__title">Member Tags</h3> 
                            <div onclick="editMemberTags('${member.id}','member_tags','Member Tags',)">
                                <i class="fa fa-edit"></i>
                            </div>
                            <div class="widget__content-NODEFINE">
                                <ul>
                                    ${member.member_tags ? tags(member.member_tags, 'member-tags') : ""}
                                </ul>    
                            </div> 
                        </div>

                        <div class="widget widget--widget_meta">
                            <h3 class="widget__title">Segment</h3>
                            <div onclick="editMemberTags('${member.id}','segment','Segment Tags',)">
                                <i class="fa fa-edit"></i>
                            </div>

                            <div class="widget__content-NODEFINE">
                                <ul>
                                    ${member.segment ? tags(member.segment, 'member-tags') : ""}
                                </ul>    
                            </div>                                
                        </div>
                        <div class="widget widget--widget_meta">
                            <h3 class="widget__title">Sustainable Development Goals</h3>
                            <div onclick="editMemberTags('${member.id}','sustainable_development_goals','Sustainable development goals',)">
                                <i class="fa fa-edit"></i>
                            </div>

                            <div class="widget__content-NODEFINE">
                                <ul>
                                    ${member.sustainable_development_goals ? tags(member.sustainable_development_goals, 'development-goals') : ""}
                                </ul>    
                            </div>                                
                        </div>



                        <div class="widget widget--widget_meta">
                            <h3 class="widget__title">Insightly Tags</h3>
                            <div class="widget__content-NODEFINE">
                                <ul>
                                    ${member.insightly_tags ? tags(member.insightly_tags, 'member-tags') : ""}
                                </ul>    
                            </div>                                
                        </div>
                    </main>
                    </div>
                </div>
            </div>

        </section>
        <!-- end middle section-->



    </div>

           
           `;
    
    $('#memberOverlay').modal('show');
}



function closeMemberOverlay() {
    $('#memberOverlay').modal('hide');
}



/**
 * orgUpdateField updates the field specified in fieldName with the
 * value in parameter fieldValue
 * org_id is the id of the org to be updated.
 * Returns true if update was OK - false if not
 * 
 */
function orgUpdateField(org_id, fieldName, fieldValue) {

    //   var member = globalMembers.find(function (member) { return member.id === member_id; }); //get the member object

    var ckanParameters = { id: org_id };
    ckanParameters[fieldName] = fieldValue;




    debugger;
    var client = new CKAN.Client(ckanServer, myAPIkey);

    client.action('organization_patch', ckanParameters,
        function (err, result) {
            if (err != null) { //some error - try figure out what
                mylog(mylogdiv, "orgUpdateField ERROR: " + JSON.stringify(err));
                console.log("orgUpdateField ERROR: " + JSON.stringify(err));
                //return false;
                return 0;
            } else // we have managed to update. We are getting the full info for the org as the result
            {
                console.log("orgUpdateField RETURN: " + JSON.stringify(result.result));
                //return true;
                return 1;
                // update the globalMembers array
                // update the screen

            }

        });


}


/** statistics
 * 
 */

(function (global) {
    var chartColors = {
        red: 'rgb(255, 99, 132)',
        blue: 'rgb(54, 162, 235)',
        orange: 'rgb(255, 159, 64)',
        green: 'rgb(75, 192, 192)',
        purple: 'rgb(153, 102, 255)',
        yellow: 'rgb(255, 205, 86)', 
        grey: 'rgb(201, 203, 207)'
    };
}(this));

function statistics() {

    var virksomhetChart = new Chart($('#canvas-virksomhet'), {
        type: 'bar',
        data: {
            labels: ['Private', 'Public', 'Civil Society', 'Research', 'Startup'],
            datasets: [{
                data: [86, 24, 8, 5, 2],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 159, 64, 0.5)',
                    'rgba(75, 192, 192, 0.5)',
                    'rgba(153, 102, 255, 0.5)'
                ],
                hoverBackgroundColor: [
                    'rgba(255, 99, 132, 0.9)',
                    'rgba(54, 162, 235, 0.9)',
                    'rgba(255, 159, 64, 0.9)',
                    'rgba(75, 192, 192, 0.9)',
                    'rgba(153, 102, 255, 0.9)'
                ],
                borderColor: ['#FF6384', '#36A2EB', 'rgb(255, 159, 64)', 'rgb(75, 192, 192)', 'rgb(153, 102, 255)'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            legend: {
                display: false
            }
        }
    });


    var segmentChart = new Chart($('#canvas-segment'), {
        type: 'bar',
        data: {
            labels: ['Mobilitet', 'Energi', 'Digitalisering'],
            datasets: [{
                data: [300, 50, 100],
                backgroundColor: [
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(255, 159, 64, 0.5)'
                ],
                hoverBackgroundColor: [
                    'rgba(54, 162, 235, 0.9)',
                    'rgba(255, 99, 132, 0.9)',
                    'rgba(255, 159, 64, 0.9)'
                ],
                borderColor: ['#36A2EB','#FF6384', 'rgb(255, 159, 64)'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            legend: {
                display: false
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });


    var sustainable_development_goalsChart = new Chart($('#canvas-sustainable_development_goals'), {
        type: 'bar',
        data: {
            labels: ['1 Utrydde fattigdom', '2 Utrydde sult', '3 God helse', '4 God utdanning', '5 Likestilling mellom kjønnene', '6 Rent vann og gode sanitærforhold', '7 Ren energi for alle'],
            datasets: [{
                data: [5, 23, 11, 2, 22, 17, 54],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 159, 64, 0.5)',
                    'rgba(75, 192, 192, 0.5)',
                    'rgba(153, 102, 255, 0.5)',
                    'rgba(255, 205, 86, 0.5)', 
                    'rgba(201, 203, 207, 0.5)'
                ],
                hoverBackgroundColor: [
                    'rgba(255, 99, 132, 0.9)',
                    'rgba(54, 162, 235, 0.9)',
                    'rgba(255, 159, 64, 0.9)',
                    'rgba(75, 192, 192, 0.9)',
                    'rgba(153, 102, 255, 0.9)',
                    'rgba(255, 205, 86, 0.9)', 
                    'rgba(201, 203, 207, 0.9)'
                ],
                borderColor: [
                    '#FF6384', 
                    '#36A2EB', 
                    'rgb(255, 159, 64)', 
                    'rgb(75, 192, 192)', 
                    'rgb(153, 102, 255)',
                    'rgb(255, 205, 86)', 
                    'rgb(201, 203, 207)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            legend: {
                display: false
            },
            tooltips: {
                callbacks: {
                  label: function(tooltipItem) {
                    return tooltipItem.yLabel;
                }
              }
            },
            responsive: true,
            scales: {
                xAxes: [{
                    display: false //this will remove all the x-axis grid lines
              }]
            },
            autoSkip: false,
            axisY:{
                labelFontSize: 20,
              },
        },
    });



}



/**
 * sets the status of login un the upper right corner.
 * 
 * 
 */
function loginStatus() {

    if (myAPIkey.length > 10) {

        document.getElementById("loginstatus").innerHTML = `
        <ul class="nav navbar-nav ml-auto">

        <li class="nav-item dropdown show">
            <a class="nav-link nav-link" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="true">
                <img id="avatarImage" class="img-avatar" src="${avatarImageDefaut}" alt="admin@bootstrapmaster.com">
            </a>
            <div class="dropdown-menu dropdown-menu-right">

                <div class="dropdown-header text-center">
                    <strong>Settings</strong>
                </div>
                <a class="dropdown-item" href="#">
                    <i class="fa fa-user"></i> Login</a>

                <a class="dropdown-item" href="#">
                    <i class="fa fa-lock"></i> Logout</a>
            </div>
        </li>
    </ul>

        `;
    } else {
        document.getElementById("loginstatus").innerHTML = `
        <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#loginForm">Login
        </button> 
                        `;



    }

}






var myAPIkey = ""; // TODO: figure out how to set this a secure way
var ckanServer = "http://data.urbalurba.com/"; // change to your own to test or use http://demo.ckan.org
//ckanServer = "http://172.16.1.96/";
//ckanServer = "http://test.urbalurba.no/";


var avatarImageDefaut = "http://icons.iconarchive.com/icons/designbolts/free-male-avatars/128/Male-Avatar-Bowler-Hat-icon.png";
//var avatarImageDefaut = "http://icons.iconarchive.com/icons/icons8/windows-8/128/Users-Name-icon.png";
var organizationImageDefaut = "http://bucket.urbalurba.com/logo/dummylogo.png";

const SBNnetworkInfo_resource_id = "2b8ad5a8-e209-4d29-959d-0460a35c2343";
let adminUsersToRemove = ["terchris"]; // the ckan main admin is usually a member. so remove that one

// For logging to screen
const mylogdiv = "mylogdiv"; //there must be a div with this name in the html file
const globalMyLog = false;

var globalSBNnetworkInfo; // First time we access SBN articles we read all of them and store them here
var globalMembers = []; // we need to access the member array after the cards are rendered



/**
 * This is the starting function. It reads the organisations from CKAN 
 * and displays the organizations/members as cards
 */
function loadOrganizationsFromCKAN() {



    var client = new CKAN.Client(ckanServer, myAPIkey);

    client.action('organization_list', { all_fields: "true", include_extras: "true", include_users: "true" },
        function (err, result) {
            if (err != null) { //some error - try figure out what
                mylog(mylogdiv, "organization_list ERROR: " + JSON.stringify(err));
                console.log("organization_list ERROR: " + JSON.stringify(err));
            } else // we have read the data
            {
                //globalMembers = JSON.parse(JSON.stringify(result.result.records));     
                globalMembers = tidyOrganizations(result.result); // add and remove stuff
                displayMemberCards(); // display the members fetched into globalMembers array                    
            }

        });




    $('a[data-toggle="tooltip"]').tooltip({
        animated: 'fade',
        placement: 'bottom',
        html: true
    });


    searching();
    getMembersDummyData();
    displayMemberCards();
    loginStatus();
    statistics();



    // for dockument ready use: });

};





/**
 * This is the starting function. It reads the organisations from CKAN 
 * and displays the organizations/members as cards
 */
function loadOrganizationsFromCKAN2() {

    const ckanURLgetOrganisations = "api/3/action/organization_list?all_fields=true&include_extras=true&include_users=true";

    var ckanURL = ckanServer + ckanURLgetOrganisations;
    axios.get(ckanURL, { crossdomain: true })
        .then(function (response) {

            globalMembers = tidyOrganizations(response.data.result); // add and remove stuff
            console.log(JSON.stringify(globalMembers));
            displayMemberCards(); // display the members fetched into globalMembers array                    

        })
        .catch(function (error) {
            mylog(mylogdiv, "organization_list ERROR: " + JSON.stringify(error));
            console.log("organization_list ERROR: " + JSON.stringify(error));
        });


    $('a[data-toggle="tooltip"]').tooltip({
        animated: 'fade',
        placement: 'bottom',
        html: true
    });


    searching();
    getMembersDummyData();
    displayMemberCards();
    loginStatus();
    statistics();



    // for dockument ready use: });

};