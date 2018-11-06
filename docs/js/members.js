
/**  tags Displays all tags on a organization as list items
 *   statment uses for search field
 * 
 */
function tags(tags, statement) {

    // tracking: that a tag is clicked
    //onclick="analytics.track('Tag click', {tag_family: statement,tag: member.tag.trim()});"

    return `
    ${tags.map(tag => ` <li><a href="#" class="tag-link" onclick="analytics.track('Tag click', {tag_family: statement,tag: member.tag.trim()});" data-statement="${statement}">${tag.trim()}</a></li> `).join("")}
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

/** getOrgTypeIcon
 * return the icon used to symbolise the org type
 * hardcoded values MUST correspond with function orgType
 * Returns icon
 */
function getOrgTypeIcon(orgType) {

    const privateIcon = 'industry';
    const municipalityIcon = 'building';
    const governmentIcon = 'institution';
    const associationIcon = 'users';
    const civilsociety_ngoIcon = 'group';
    const academiaIcon = 'graduation-cap';
    const researchIcon = 'flask';

    const defaultIcon = 'support';

    var icon = '';
    var orgTypeDisplayTxt = '';
    /* The case values here must correspond with the names in the extended schema for urbalurba*/
    switch (orgType) {
        case 'private':
            icon = privateIcon;
            orgTypeDisplayTxt = 'Privat';
            break;
        case 'municipality':
            icon = municipalityIcon;
            orgTypeDisplayTxt = 'Kommune';
            break;
        case 'government':
            icon = governmentIcon;
            orgTypeDisplayTxt = 'Offentlig';
            break;
        case 'association':
            icon = associationIcon;
            orgTypeDisplayTxt = 'Forening';
            break;
        case 'civil_society_ngo':
            icon = civilsociety_ngoIcon;
            orgTypeDisplayTxt = 'Sivilsamfunn';
            break;
        case 'academia':
            icon = academiaIcon;
            orgTypeDisplayTxt = 'Akademia';
            break;
        case 'research':
            icon = researchIcon;
            orgTypeDisplayTxt = 'FoU';
            break;



        default:
            icon = defaultIcon;
    }

    return icon;
}




/**
 *  Figuring out what icon to symbolize organisation type
 * Icon set https://fontawesome.com/v4.7.0/icons/
 * NB the fa icon's are used in filtering so if you change. Make sure to change search to
*/
function orgType(orgType) {

    const privateIcon = 'industry';
    const municipalityIcon = 'building';
    const governmentIcon = 'institution';
    const associationIcon = 'users';
    const civilsociety_ngoIcon = 'group';
    const academiaIcon = 'graduation-cap';
    const researchIcon = 'flask';

    const defaultIcon = 'support';

    var icon = '';
    var orgTypeDisplayTxt = '';
    /* The case values here must correspond with the names in the extended schema for urbalurba*/
    switch (orgType) {
        case 'private':
            icon = privateIcon;
            orgTypeDisplayTxt = 'Privat';
            break;
        case 'municipality':
            icon = municipalityIcon;
            orgTypeDisplayTxt = 'Kommune';
            break;
        case 'government':
            icon = governmentIcon;
            orgTypeDisplayTxt = 'Offentlig';
            break;
        case 'association':
            icon = associationIcon;
            orgTypeDisplayTxt = 'Forening';
            break;
        case 'civil_society_ngo':
            icon = civilsociety_ngoIcon;
            orgTypeDisplayTxt = 'Sivilsamfunn';
            break;
        case 'academia':
            icon = academiaIcon;
            orgTypeDisplayTxt = 'Akademia';
            break;
        case 'research':
            icon = researchIcon;
            orgTypeDisplayTxt = 'FoU';
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
 * Read all articles in the dataset id SBNnetworkInfo_resource_id into the array globalSBNnetworkInfo
 *  If the articles are already in the globalSBNnetworkInfo array. Then the articles are displayed 
 */
function readSBNnetworkInfo_axios(member) {

    if (Array.isArray(globalSBNnetworkInfo)) { // the array is already read
        return `
            ${displayArticles(member)} 
            `;
    } else {
        // First call. Read it from server
        const ckanURLgetDataset = "api/3/action/datastore_search?resource_id=" + SBNnetworkInfo_resource_id;

        var ckanURL = ckanServer + ckanURLgetDataset;

        axios.get(ckanURL, { crossdomain: true })
            .then(function (response) {
                globalSBNnetworkInfo = JSON.parse(JSON.stringify(response.data.result.records));
                document.getElementById("SBNnetworkInfo_resource_id").innerHTML = `
                ${displayArticles(member)} 
            `;
                //console.log("Articles read and displayed");

            })
            .catch(function (error) {
                mylog(mylogdiv, "datastore_search ERROR: " + JSON.stringify(error));
                console.log("datastore_search ERROR: " + JSON.stringify(error));
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
                    $target.attr('style', 'display:none !important')
                }
            });

            $overall = $targets.filter(':visible').length;
            updateSearchStatus(text, 'Found ' + $overall);
            if ($overall === 0) {
                updateSearchStatus(text, 'No search results found');

            }

        } else {
            $('#searchReset').hide('fast');
            updateSearchStatus(text, 'Found ' + $overall);
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
function readEmployees_axios(member) {

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

                const ckanURLgetDataset = "api/3/action/datastore_search?resource_id=" + member.employee_resource_id;

                var ckanURL = ckanServer + ckanURLgetDataset;

                axios.get(ckanURL, { crossdomain: true })
                    .then(function (response) {
                        member.employees = JSON.parse(JSON.stringify(response.data.result.records));     // copy the employees array to the member 
                        // we must attach to the div id employees the first time because it has taken time to fetch the employees
                        document.getElementById("employees").innerHTML = `
                        ${displayEmployeesSidebar(member)} 
                    `;

                    })
                    .catch(function (error) {
                        console.log("readEmployees ERROR: " + JSON.stringify(error));
                        mylog(mylogdiv, "readEmployees ERROR: " + JSON.stringify(error));
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
            "contact_name": "Tony Olsen",
            "id": "ab0394bf-07a3-43ea-82f4-0eeb3d2e6a8f",
            "display_name": "ABAX",
            "approval_status": "approved",
            "sustainable_development_goals": [
                "8",
                "9",
                "11",
                "12"
            ],
            "is_organization": true,
            "member": "yes",
            "state": "active",
            "type": "organization",
            "website": "https://www.abax.no/",
            "description": "Teknologi forandrer måten verden fungerer på, og dette påvirker alle deler av arbeidslivet. For ABAX betyr det at vi må tilby smarte løsninger som gir deg adgang til hele arbeidsplassen din, uavhengig av om du befinner deg i bilen, på kontoret eller ute i felt. Derfor er vår Mission Statement \"Solutions Provider for The Connected Workspace\".\n\nVåre tjenester hjelper kundene å holde seg oppdaterte, bli mer effektive og spare penger ved å tilby Internet of Things-løsninger (IoT) i verdensklasse. ABAX er det raskest voksende telematikkselskapet i Europa og fokuserer på å levere IoT-løsninger som maksimerer verdien for våre kunder. \n\nVed å tilby mobilitet, fleksibilitet og brukervennlighet tror ABAX på et sømløst integrert IoT-domene som løser hverdagsproblemer for vår målgruppe. Alle aspekter av våre tjenester kommuniserer med hverandre for å kunne tilby maksimal fleksibilitet og en ledende løsning innen kommunikasjonsnettverk og nettverkstjenester.\n\nBusinessmodellen vår er basert på en SaaS-løsning (Software as a Service). Vi har bygd en fullt integrert softwareplatform som kan tilpasses fremtidens innovative tjenester. Vår hardware, software og våre produkter er lette å installere og bruke. \n\nHos ABAX jobber over 400 ansatte, fordelt på salg, kundeservice, markedsføring, administrasjon, kvalitet og utvikling. Vi har kontorer i Norge, Sverige, Danmark, Finland, Nederland, Polen, England, Tyskland og Kina. Hovedkontoret ligger i Larvik, Norge.",
            "main_adddress": "Hammergata 24, 3264 Larvik, Norway",
            "phone": "22 22 22 99",
            "contact_email": "To@abax.no",
            "contact_mobile": "46842441",
            "organization_number": "993098736",
            "contact_title": "Salgsansvarlig kommune",
            "segment": [
                "mobilitet",
                "telematikk",
                "digitalisering"
            ],
            "member_tags": [
                "iot",
                "mobilitet",
                "telematikk",
                "kjørebok",
                "flåtestyring",
                "worker",
                "smartere arbeidsdag"
            ],
            "slogan": "The difference is ABAX",
            "name": "abax",
            "created": "2018-09-10T20:26:01.953614",
            "organization_type": "private",
            "image_display_url": "http://bucket.urbalurba.com/logo/abax.jpg",
            "insightly_tags": [
                "=sbnmedlemsvirksomhet",
                "ckan-export",
                "hurtigruten2018",
                "ss_privat"
            ],
            "image_url": "http://bucket.urbalurba.com/logo/abax.jpg",
            "title": "ABAX",
            "revision_id": "03fb8c48-25f5-4a7c-a338-448c5b0eda28",
            "employee_resource_id": "",
            "insightly_id": "98965342",
            "users": []
        },
        {
            "package_count": 1,
            "num_followers": 0,
            "contact_name": "Dan Vigeland",
            "id": "e8d52059-1139-4b58-8169-52314ba56d7a",
            "display_name": "Acando",
            "approval_status": "approved",
            "sustainable_development_goals": [
                "3",
                "11",
                "17"
            ],
            "is_organization": true,
            "member": "yes",
            "state": "active",
            "type": "organization",
            "website": "https://www.acando.no/",
            "description": "Acando er et konsulentselskap som jobber med digitale transformasjoner i offentlig og private virksomheter. Teknologi er en sentral driver til forandring, men det er brukerens evne og ønske om å ta teknologien i bruk som skaper verdi. Med teknisk spisskompetanse og inngående innsikt i brukeratferd og forretningsutvikling drevet av digitalisering, skaper vi idéer, løsninger og mobiliserer organisasjoner til forandring. Et av våre satsningsområder er Smart City der Intelligente Transportsystemer (ITS) og selvkjørende minibusser i alminnelig trafikkmiljø, er en del av satsningen..",
            "main_adddress": "Tordenskioldsgate 8-10, 0160 Oslo, Norway",
            "phone": "930 01 000",
            "contact_email": "dan.vigeland@acando.no",
            "contact_mobile": "93248286",
            "organization_number": "979191138",
            "contact_title": "Director Smart City",
            "segment": [
                "mobilitet",
                "robotics"
            ],
            "member_tags": [
                "digital strategy",
                "iot",
                "data analytics",
                "autonomous"
            ],
            "slogan": "Digitalt konsulentselskap",
            "name": "acando",
            "created": "2018-06-25T07:59:09.815586",
            "organization_type": "private",
            "image_display_url": "http://bucket.urbalurba.com/logo/acando.jpg",
            "insightly_tags": [
                "+oslo",
                "=sbnmedlemsvirksomhet",
                "ckan-export",
                "digitalstrategi",
                "hurtigruten2018",
                "-iot",
                "it",
                "konsulent",
                "smartcity",
                "ss_innovation",
                ".dataanalytics",
                ".mobility",
                ".robotics",
                "ss_privat"
            ],
            "image_url": "http://bucket.urbalurba.com/logo/acando.jpg",
            "title": "Acando",
            "revision_id": "72e579d4-6b7d-4904-a6cf-83100baefc22",
            "employee_resource_id": "dddd5155-24ea-4604-a41d-413494aaeb23",
            "insightly_id": "95288967",
            "users": []
        },
        {
            "package_count": 0,
            "num_followers": 0,
            "contact_name": "Kaja Goplen",
            "id": "adf6476e-cfa7-41ad-96e2-cd3d6cb12c3b",
            "display_name": "Advokatfirma Recurso",
            "approval_status": "approved",
            "sustainable_development_goals": "",
            "is_organization": true,
            "member": "yes",
            "state": "active",
            "type": "organization",
            "website": "http://www.recurso.no/",
            "description": "Juridisk rådgivning til bedrifter og privatpersoner. Spesialfelt arbeidsrett og megling, samt bistand i fbm bedriftsoppstart og utviklingsprosesser.\nRecurso AS yter effektiv, løsningsorientert og personlig rådgivning og bistand til sine klienter og samarbeidspartnere. \n\nVår visjon er at ressurs er elementært og nødvendig i alt som skal gjøres, og ressurser er til for å brukes. Vi arbeider fremoverlent, for å hjelpe våre kunder til å oppnå gode og konstruktive resultater. Du/dere skal oppleve at vårt arbeid utføres med gjensidig tillit og at vi jobber ut ifra et helhetlig perspektiv.",
            "main_adddress": "Rødbergveien 2b, 0591 Oslo, Norway",
            "phone": "416 95 522",
            "contact_email": "kontakt@recurso.no",
            "contact_mobile": "416 95 522",
            "organization_number": "91743534",
            "contact_title": "Advokat - Daglig leder",
            "segment": [
                "advokater og juridiske tjenester"
            ],
            "member_tags": [
                "rårdgiving"
            ],
            "slogan": "Juridisk rådgivning til bedrifter og privatpersoner.",
            "name": "recurso",
            "created": "2018-06-25T07:59:23.463640",
            "organization_type": "private",
            "image_display_url": "http://bucket.urbalurba.com/logo/recruso.jpg",
            "insightly_tags": [
                "+oslo",
                "=sbnmedlemsvirksomhet",
                "ss_privat",
                "ckan-export"
            ],
            "image_url": "http://bucket.urbalurba.com/logo/recruso.jpg",
            "title": "Advokatfirma Recurso",
            "revision_id": "6b3873cc-6453-4f54-9fcb-c7fcafad2a97",
            "employee_resource_id": "",
            "insightly_id": "120770018",
            "users": []
        },
        {
            "package_count": 0,
            "num_followers": 0,
            "contact_name": "Øystein Johansen",
            "id": "92ffaf0e-58f1-4722-9697-1b46d04d1945",
            "display_name": "ÅF Lighting Norge",
            "approval_status": "approved",
            "sustainable_development_goals": "",
            "is_organization": true,
            "member": "yes",
            "state": "active",
            "type": "organization",
            "website": "http://www.afconsult.com/",
            "description": "Rådgivning, offentlig belysning",
            "main_adddress": "Lilleakerveien 8, 0283 Oslo, Norway",
            "phone": "24101010",
            "contact_email": "Oystein.Johansen@afconsult.com",
            "contact_mobile": "992 13 064",
            "organization_number": "991211845",
            "contact_title": "Office Manager",
            "segment": [
                "automotive and vehicles",
                "energy",
                "life science",
                "infrastructure",
                "telecom",
                "real estate",
                "process industry"
            ],
            "member_tags": [
                "engineering and consulting company"
            ],
            "slogan": "Rådgivning, offentlig belysning",
            "name": "af-lighting-norge",
            "created": "2018-06-25T07:59:17.332160",
            "organization_type": "private",
            "image_display_url": "http://bucket.urbalurba.com/logo/af-logo-tag-black.jpg",
            "insightly_tags": [
                "+oslo",
                "=sbnmedlemsvirksomhet",
                "ckan-export",
                "smartcity",
                "ss_privat",
                "sustainability"
            ],
            "image_url": "http://bucket.urbalurba.com/logo/af-logo-tag-black.jpg",
            "title": "ÅF Lighting Norge",
            "revision_id": "0a13b677-28ae-4419-81d6-e6a149f660ba",
            "employee_resource_id": "",
            "insightly_id": "114887093",
            "users": []
        },
        {
            "package_count": 0,
            "num_followers": 0,
            "contact_name": "Gjermund Lanestedt",
            "id": "91714600-d5be-403b-bed9-edb35f500c37",
            "display_name": "Agenda Kaupang",
            "approval_status": "approved",
            "sustainable_development_goals": "",
            "is_organization": true,
            "member": "yes",
            "state": "active",
            "type": "organization",
            "website": "https://www.agendakaupang.no/",
            "description": "Agenda Kaupang er et norsk konsulentselskap. Vi tilbyr analyse, utredning og rådgiving innen områdene ledelse, styring, økonomi og organisasjonsutvikling. Agenda Kaupangs kunder er primært i offentlig sektor, samt blant bedrifter og organisasjoner i arbeidslivet.",
            "main_adddress": "Holtet 45 , 1368 Stabekk, Norway",
            "phone": "95195648",
            "contact_email": "gjermund.lanestedt@agendakaupang.no",
            "contact_mobile": "95195648",
            "organization_number": "968938525",
            "contact_title": "Seniorrådgiver",
            "segment": "",
            "member_tags": "",
            "slogan": "Rådgivere for offentlig sektor",
            "name": "agenda-kaupang",
            "created": "2018-06-25T07:59:03.961605",
            "organization_type": "private",
            "image_display_url": "http://bucket.urbalurba.com/logo/agenda.jpg",
            "insightly_tags": [
                "=sbnmedlemsvirksomhet",
                "ckan-export",
                "konsulent",
                "ss_privat",
                "smartcity"
            ],
            "image_url": "http://bucket.urbalurba.com/logo/agenda.jpg",
            "title": "Agenda Kaupang",
            "revision_id": "5bfba88f-0dc7-41d4-bc05-83fb04a2b98d",
            "employee_resource_id": "",
            "insightly_id": "90622205",
            "users": []
        },
        {
            "package_count": 0,
            "num_followers": 0,
            "contact_name": "Harald Jellum",
            "id": "486f9c87-d814-4c29-8fa2-5c97ca96d675",
            "display_name": "AISPOT",
            "approval_status": "approved",
            "sustainable_development_goals": "",
            "is_organization": true,
            "member": "yes",
            "state": "active",
            "type": "organization",
            "website": "https://aispot.no/",
            "description": "Aispot helps retail and destinations engage customers and increase loyalty. Enabling the concept of Future Shopping. Clients Simply connect to – and publish to their customers through a shared mobile platform utilizing beacons, QR, club, mobile Wallet and a range of ready-made services",
            "main_adddress": "Pier X Bryggegata 3, 0250 Oslo, Norway",
            "phone": "90020538",
            "contact_email": "harald@aispot.no",
            "contact_mobile": " 91543432",
            "organization_number": "91593967",
            "contact_title": "Gründer",
            "segment": [
                "tourism",
                "mobile wallet",
                "mobile assistant",
                "digital services",
                "innovation",
                "e-commerce",
                "iot"
            ],
            "member_tags": [
                "tourism",
                "mobile wallet",
                "mobile assistant",
                "digital services",
                "innovation",
                "e-commerce",
                "iot"
            ],
            "slogan": "IoT og app for varehandel og reiseliv",
            "name": "aispot",
            "created": "2018-06-25T07:59:23.363859",
            "organization_type": "private",
            "image_display_url": "http://bucket.urbalurba.com/logo/aispot.jpg",
            "insightly_tags": [
                "=sbnmedlemsvirksomhet",
                "ckan-export",
                "ss_privat",
                "+oslo",
                "-iot",
                "smartcity"
            ],
            "image_url": "http://bucket.urbalurba.com/logo/aispot.jpg",
            "title": "AISPOT",
            "revision_id": "9b20053e-17db-4c39-b4b8-8766c05ed0e3",
            "employee_resource_id": "",
            "insightly_id": "120108147",
            "users": []
        }
    ];


    /*
    
    */


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



/*** displayOrgTypes 
 * Displays the different org types and the count
 *  var countedOrgTypes = {organization_type: [], count: [] }
 * onclick="filterByOrgType(countedOrgTypes.organization_type[i])"
 */
function displayOrgTypes() {
    var dummy = "";

    dummy = '<div class="row ">';

    for (var i = 0; i < countedOrgTypes.count.length; i++) {
        dummy = dummy + '<div onclick="filterByOrgType(countedOrgTypes.organization_type[';
        dummy = dummy + i;
        dummy = dummy + '])" class="col-sm-12 col-md mb-sm-2 mb-0">';
        dummy = dummy + '<i class="fa fa-';
        dummy = dummy + getOrgTypeIcon(countedOrgTypes.organization_type[i]);
        dummy = dummy + ' fa-lg mt-4"> </i>';
        dummy = dummy + ' <div class="text-muted">';
        dummy = dummy + countedOrgTypes.organization_type[i];
        dummy = dummy + '</div>';
        dummy = dummy + '<strong>';
        dummy = dummy + countedOrgTypes.count[i];
        dummy = dummy + '</strong>';
        dummy = dummy + '</div>';
    }
    dummy = dummy + "</div> "
    document.getElementById("displayOrgTypes").innerHTML = dummy;

}




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
        ckan_name: member.name,
        display_name: member.display_name
    });

    /****  
        TODO: this stuff is about setting the url and handling back button. Not done yet  
        // change page title to the member beeing displayed
        var memberPageTitle = pageTitle + ": " + member.display_name;
        document.title = memberPageTitle
        var memberURL = "?name="  + member.name;
        	
        window.history.pushState('', memberPageTitle, memberURL); //TODO: handle back button
    
        // TODO: change the og attributes $('meta[name="og:title"]').attr('content', pageTitle + ": " + member.display_name);
    *///

    document.getElementById("displayProfile").innerHTML = `

<section>
    <div class="container no-padding">
        <div class="row">
            <div class="col">
                <div class="bg-white text-center">
                            <button type="button" class="close closebtn"  data-dismiss="modal" aria-label="Close" onclick="closeMemberOverlay('${member.name}','${member.display_name}');">
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
                                    ${readEmployees_axios(member)} 
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
                            <h3 class="widget__title">Problem som løses</h3>
                            <div class="widget__content-NODEFINE">
                                <ul>
                                    ${member.insightly_tags ? tags(member.insightly_tags, 'member-tags') : ""}
                                </ul>    
                            </div>                                
                        </div>
                    </main>

                    <main class="col-sm-12 col-lg-12" >
                        <div id="SBNnetworkInfo_resource_id">
                                ${readSBNnetworkInfo_axios(member)}    
                            </div>
                        </div>
                    </main>
                </div>
            </div>

        </section>
        <!-- end middle section-->



    </div>

           
           `;

    $('#memberOverlay').modal('show');
}


/**** closeMemberOverlay
 * called when member is closed
 * 
 */
function closeMemberOverlay(name, display_name) {
    // This is not needed $('#memberOverlay').modal('hide');

    /** TODO: handling back button
        window.history.back();
    
        document.title = pageTitle ; // change page title back to pageTitle
    ***/
    // tracking that we are closing a member
    analytics.track('Close member', {
        ckan_name: name,
        display_name: display_name
    });


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
    var client = new CKAN.Client(ckanServer, myAPIkey); //TODO: remove ckan

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
        type: 'pie',
        data: {
            labels: countedOrgTypes.organization_type,
            datasets: [{
                data: countedOrgTypes.count,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 159, 64, 0.5)',
                    'rgba(75, 192, 192, 0.5)',
                    'rgba(153, 102, 255, 0.5)',
                    'rgb(255, 205, 86, 0.5)'
                ],
                hoverBackgroundColor: [
                    'rgba(255, 99, 132, 0.9)',
                    'rgba(54, 162, 235, 0.9)',
                    'rgba(255, 159, 64, 0.9)',
                    'rgba(75, 192, 192, 0.9)',
                    'rgba(153, 102, 255, 0.9)',
                    'rgb(255, 205, 86, 0.9)'
                ],
                borderColor: ['#FF6384', '#36A2EB', 'rgb(255, 159, 64)', 'rgb(75, 192, 192)', 'rgb(153, 102, 255)'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            legend: {
                position: 'bottom',
                labels: {
                    boxWidth: 10
                }
            },
            onClick: function (event) {
                var activePoints = virksomhetChart.getElementsAtEvent(event);
                if (activePoints[0]) {
                    var chartData = activePoints[0]['_chart'].config.data;
                    var idx = activePoints[0]['_index'];
                    var label = chartData.labels[idx];
                    var txt = "Du klikket: " + label;
                    //console.log(txt);
                    //alert(txt);
                    filterByOrgType(label);
                }

            }
        }
    });


    var segmentChart = new Chart($('#canvas-segment'), {
        type: 'horizontalBar',
        data: {

            labels: countedSegmentTypes.segment,
            datasets: [{
                data: countedSegmentTypes.count,
                backgroundColor: "#00b0f0"
            }]
        },
        options: {

            scales: {
                yAxes: [{
                    barThickness: 10
                }],
            },
            responsive: true,
            maintainAspectRatio: false,
            legend: {
                display: false,
                labels: {
                    boxWidth: 10
                }
            },

            onClick: function (event) {
                var activePoints = segmentChart.getElementsAtEvent(event);
                if (activePoints[0]) {
                    var chartData = activePoints[0]['_chart'].config.data;
                    var idx = activePoints[0]['_index'];
                    var label = chartData.labels[idx];
                    var txt = "Du klikket: " + label;
                    //console.log(txt);
                    //alert(txt);
                    filterByTag(label, tagGroup)
                }
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
                    label: function (tooltipItem) {
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
            axisY: {
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



/*** countDistinctSegmentTypes
 * 
 * 
 */
function countDistinctSegmentTypes() {

    /* ramblings 
        allSegmentTypes.forEach(segmArray => {
            segmArray.forEach(segments => {
                flatSegmentArray.push(segments);
            }
        });
    
    * end ramblings */



    const allSegmentTypes = globalMembers.map(x => x.segment); // create an array of all organization_type

    //console.log(JSON.stringify(allSegmentTypes, 0, 4));
    var flatSegmentArray = [];

    // old school looping - lodash kandidate
    for (var i = 0; i < allSegmentTypes.length; i++) {
        var segmetSegmentArray = allSegmentTypes[i];
        // if no array skip else loop it 
        for (var j = 0; j < segmetSegmentArray.length; j++) {
            flatSegmentArray.push(segmetSegmentArray[j]);
        }
    }

    var countedSermentTypesKeypair = Object.create(null);
    // counts the different segment types- but make it in a key pair array
    flatSegmentArray.forEach(segment => {
        countedSermentTypesKeypair[segment] = countedSermentTypesKeypair[segment] ? countedSermentTypesKeypair[segment] + 1 : 1;
    });

    // console.log(JSON.stringify(countedSermentTypesKeypair, 0, 4));
    // console.log(JSON.stringify(countedSermentTypesKeypair));

    countedSegmentTypes = { segment: [], count: [] }; //reset before counting

    // transform the key pair to a structure that can be used by chart.js
    for (var key in countedSermentTypesKeypair) {     // For each item in your object
        countedSegmentTypes.segment.push(key);
        // ... and the value as a new data
        countedSegmentTypes.count.push(countedSermentTypesKeypair[key]);
    }

    //console.log(JSON.stringify(countedSegmentTypes, 0, 4));


}



/** countDistinctOrgTypes
 * Count the different org types so that it can be displayed in chartjs
 * Thanks to Andreas Can Atakan for this rewrite.
 */

function countDistinctOrgTypes() {

    // Testing a new approch

    const allOrgTypes = globalMembers.map(x => x.organization_type); // create an array of all organization_type

    var countedOrgTypesKeypair = Object.create(null);
    countedOrgTypes = { organization_type: [], count: [] }; //reset the array containing the results

    // Counting all unique org types.
    for (var i = 0; i < allOrgTypes.length; i++) {
        countedOrgTypesKeypair[allOrgTypes[i]] = 1 + (countedOrgTypesKeypair[allOrgTypes[i]] || 0);
    }

    // Transforming the data by adding all key strings to the organization_type array
    // and all values to count array
    for (var key in countedOrgTypesKeypair) {
        countedOrgTypes["organization_type"].push(key);
        countedOrgTypes["count"].push(countedOrgTypesKeypair[key]);
    }




}

var myAPIkey = ""; // TODO: figure out how to set this a secure way
var ckanServer = "http://data.urbalurba.com/"; // change to your own 
//ckanServer = "http://172.16.1.96/"; //for testing on local ubuntu VM
//ckanServer = "http://test.urbalurba.no/";


var avatarImageDefaut = "http://icons.iconarchive.com/icons/designbolts/free-male-avatars/128/Male-Avatar-Bowler-Hat-icon.png";
//var avatarImageDefaut = "http://icons.iconarchive.com/icons/icons8/windows-8/128/Users-Name-icon.png";
var organizationImageDefaut = "http://bucket.urbalurba.com/logo/dummylogo.png";


const SBNnetworkInfo_resource_id = "2b8ad5a8-e209-4d29-959d-0460a35c2343"; //for testing on local ubuntu VM 
let adminUsersToRemove = ["terchris"]; // the ckan main admin is usually a member. so remove that one

// For logging to screen
const mylogdiv = "mylogdiv"; //there must be a div with this name in the html file
const globalMyLog = false;

var globalSBNnetworkInfo; // First time we access SBN articles we read all of them and store them here
var globalMembers = []; // we need to access the member array after the cards are rendered

const pageTitle = "Smartbykatalogen";   // page title for web page
document.title = pageTitle; //set it


var countedOrgTypes = { organization_type: [], count: [] }; // This is where we place each distinct organization_type and the count for each organization_type 
var countedSegmentTypes = { segmenttype: [], count: [] }; // This is where we place each distinct organization_type and the count for each organization_type 




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
            //console.log(JSON.stringify(globalMembers));
            displayMemberCards(); // display the members fetched into globalMembers array                    
            countDistinctOrgTypes(); // Count the number of different org types
            countDistinctSegmentTypes(); // Count the number of different segment types
            statistics(); //Display updated statistics
            displayOrgTypes(); //display the different org types and their count

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
    //countDistinctOrgTypes(); // Count the number of different org types
    //countDistinctSegmentTypes(); // Count the number of different segment types
    //statistics();





    // for dockument ready use: });

};