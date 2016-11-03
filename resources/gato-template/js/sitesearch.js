
jQuery(document).ready(function($) {

    //check for search parameters
    if(window.location.search.length > 0 && window.location.href.indexOf("sitesearch") != -1){
        var params = getUrlParameters();
        siteSearch((params.sitesearch || "txstate.edu"), (params.query || ""), params.page || 1, params.sort || "relevance");
        handleBreadCrumbs();
    }

    //this makes the top results drop down stay the same size
    //as the input field
    jQuery.ui.autocomplete.prototype._resizeMenu = function () {
      var ul = this.menu.element;
      ul.outerWidth(this.element.outerWidth());
    }

    //top 3 search results shown after user types 3 characters
    //in search box
    $('#search-text').autocomplete({
        minLength: 3,
        open: function( event, ui ) {
            var dialogZIndex = $('.ui-dialog').css('z-index');
            $('.ui-autocomplete').css('z-index', dialogZIndex + 1);

        },
        source: function(request, response){
            var options = {num: 3};
            if($('#this-site').prop('checked')){
                options.sitesearch = $('#sitesearch').val();
            }
            var search = new Search(options);
            search.doSearch(request.term)
            .then(function(results){
                var data = results.results.map(function(obj){
                    var result = {title: obj.title, url_display: obj.url_display, url: obj.url};
                    return result;
                });
                response(data);
            });
        },
        select: function(event, ui){
            event.preventDefault();
            window.location = ui.item.url;
        }
    })
    .autocomplete( "instance" )._renderItem = function( ul, item ) {
      return $( '<li class="suggestion">' )
        .append( '<div class="suggestion-title">' +
                    '<a href="#">' + item.title + '</a>' +
                 '</div>')
        .append('<div class="display-link">' +
                    '<a href="#">' + item.url_display + '</a>' +
                '</div>')
        .appendTo( ul );
    };

    $('.searchbar-form').submit(function(e){
        e.preventDefault();

        //close the search modal
        $('#search-modal-content').dialog('close');

        //redirect to global search if the user is on the homepage or selected that
        //they want to search all of Texas State instead of doing a site search
        if($('#sitesearch').length == 0 || $('#txst-all').prop('checked')){
            var params = {
                site: "txstate_no_users",
                client: "txstate",
                output: "xml_no_dtd",
                proxystylesheet: "txstate",
                q: $('#search-text').val()
            };
            var url = "http://search.txstate.edu/search?" + $.param(params);
            window.location = url;
        }
        else{
            //search this site
            var query = $('#search-text').val();
            //clear the search field
            $('#search-text').val("");
            var site = $('#sitesearch').val();
            siteSearch(site, query, 1, "relevance");
            handleBreadCrumbs();
            var searchResultUrl = addQueryString(window.location.href, site, query, 1);
            history.pushState(null, null, searchResultUrl);
        }
    })

    //take the current url and add a query string to it so that the search results page can be
    //added to the history
    function addQueryString(url, site, query, num){
        var newQueryParams = "sitesearch=" + site + "&query=" + query + "&page=" + num;
        var urlNoHash=url;
        var hash="";
        if(url.indexOf('#') != -1){
            var urlParts = url.split("#");
            urlNoHash = urlParts[0];
            hash = urlParts[1];
        }
        //check if it already has a querystring
        if(url.indexOf('?') != -1){
            urlNoHash += "&" + newQueryParams;
        }
        else{
            urlNoHash += "?" + newQueryParams;
        }
        //add hash back in if there was one
        return urlNoHash + ((hash.length > 0) ? "#" + hash : "");
    }

    //Calls the google search appliance with the appropriate parameters and display
    //results on the current page.  The search results are inserted after the original
    //page content and the original page content is hidden.
    function siteSearch(site, query, startPage, sortType){
        var sort = (sortType == "date") ? "date:D:S:d1" : "relevance";
        var start = (startPage <= 1) ? 0 : (10 * (startPage -1));
        var search = new Search({site: site, start: start, num: 10, sort: sort});
        search.doSearch(query)
        .then(function(results){
            var page = buildSearchResultsPage(site, query, results.results, results.total, startPage, sortType);
            $('#search-results').remove();
            $('.page_content').after(page);
            $('.page_content').hide();
            $('.search-again .searchbar-form .icon').hide();
            create_event_handlers();
        })
        .fail(function(){
            console.log("error")
        })
    }

    //Modifies the breadcrumbs to account for the search results page.  If the original page
    //is called "Best Page Ever," then "Best Page Ever" becomes a link to itself in the breadcrumbs
    // and > Search Results is added to the end of the breadcrumbs.
    function handleBreadCrumbs(){
        if($('.searchbreadcrumbs')) $('.searchbreadcrumbs').remove();
        var breadcrumbs = $('#panel .breadcrumbs');
        var searchbreadcrumbs = breadcrumbs.clone().addClass('searchbreadcrumbs');
        var contents = searchbreadcrumbs.contents();
        contents.get(contents.size() -1).remove();  //remove last text element
        contents.get(searchbreadcrumbs.size() -1).remove();
        var url = window.location.href;
        if(url.indexOf("sitesearch") != -1){
            console.log("need to remove parameters")
            var params = getUrlParameters();
            delete params.sitesearch;
            delete params.query;
            delete params.page;
            delete params.sort;
            url = window.location.pathname;
            if(!$.isEmptyObject(params)){
                console.log("more parameters")
                url += createUrlQuery(params);
            }
            url += window.location.hash;
        }
        searchbreadcrumbs.append('<a href="' + url + '">' + $('#maincontent').text() + '</a>');
        searchbreadcrumbs.append('<span class="separator"><i class="fa fa-angle-right"></i></span>');
        searchbreadcrumbs.append(document.createTextNode(' Search Results'));
        breadcrumbs.after(searchbreadcrumbs);
        searchbreadcrumbs.show();
        breadcrumbs.hide();
    }

    //This handles the case where the user navigates to/from the search results page using the
    //back and forward buttons in the browser
    $(window).on("popstate", function() {
        if(window.location.search.length > 0 && window.location.href.indexOf("sitesearch") != -1){
            //The user navigated to a search results page
            var params = getUrlParameters();
            siteSearch((params.sitesearch || "txstate.edu"), (params.query || ""), params.page || 1, params.sort || "relevance");
            handleBreadCrumbs();
        }
        else if ($('#search-results.global').length == 0) {
            //The user went to the original page
            $('#search-results').remove();
            $('.page_content').show();
            $('.breadcrumbs').show();
            $('.searchbreadcrumbs').remove();
        }
    });

    var create_event_handlers = function() {
        //handle clicks on pagination and sorting links and search again clicks
        $('.pagination-link').click(function(e){
            var target = $(e.target);
            e.preventDefault();
            var site = $('#search-info').data('site');
            var query = $('#search-info').data('query');
            var sortSelection = $('.sort-link.active').attr('id');
            var sort = $('#search-info').data('sort');
            var pageNum;
            if(target.is('.pagination-link-next')){
                //clicked on "Next"
                var activePage = $('.pagination-link.active').first().text();
                pageNum = parseInt(activePage) + 1;
            }
            else if(target.is('.pagination-link-prev')){
                //clicked on "Prev"
                var activePage = $('.pagination-link.active').first().text();
                pageNum = activePage - 1;
            }
            else{
                //clicked on specific page number
                pageNum = $(e.target).text();
            }
            siteSearch(site, query, pageNum, sort);
            addOrUpdateQSParam("page", pageNum);
        });
        $('.sort-link').click(function(e){
            var target = $(e.target);
            e.preventDefault();
            var site = $('#search-info').data('site');
            var query = $('#search-info').data('query');
            var sort;
            if(target.is('#relevance-sort')){
                //sort by relevance
                $('#date-sort').removeClass('active');
                $('#relevance-sort').addClass('active');
                sort="relevance";
            }
            else if(target.is('#date-sort')){
                //sort by date
                $('#relevance-sort').removeClass('active');
                $('#date-sort').addClass('active');
                sort = "date";
            }
            siteSearch(site, query, 1, sort);
            addOrUpdateQSParam("sort", sort);
        });
        $('.search-again .reset').click(function(e){
            $('.search-again .search').val("");
            $('.search-again .reset').hide();
            $('.search-again .searchbar-form .icon').show();
        });
        $('.search-again .searchbar-form .icon').click(function(e){
            e.preventDefault();
            var site = $('#search-info').data('site');
            var query = $('.search-again .searchbar-form .search').first().val();
            siteSearch(site, query, 1, "relevance");
            addOrUpdateQSParam("query", query);
            addOrUpdateQSParam("sort", "relevance");
        });

        $('.search-again .searchbar-form .search').keyup(function(e){
            var target = $(e.target);
            //If they changed the value in the searchbox, replace X with magnifying glass
            if(target.val() != $('#search-info').data('query')){
                $('.search-again .reset').hide();
                $('.search-again .searchbar-form .icon').show();
            }
        });
    }

    //searches the query string for a parameter with a key matching
    //the name value passed in. if it is found, the value is changed to
    //the value passed in.  If it isn't found, it is added to the query string
    function addOrUpdateQSParam(name, value){
        var updatedQS, qs = window.location.search.substring(1);
        if(qs.length > 0){
            var found = false;
            var params = qs.split('&');
            for(var i=0; i<params.length; i++){
                var param = params[i].split("=");
                if(param[0] == name){
                    param[1] = value ;
                    found = true;
                }
                params[i] = param.join("=");
            }
            if(found)
                updatedQS = "?" + params.join("&");
            else
                updatedQS = "?" + qs + "&" + name + "=" + value;
        }
        else{
            updatedQS = "?" + name + "=" + value;
        }
        var url = window.location.pathname + updatedQS + window.location.hash;
        history.pushState(null, null, url);
    }
});

//build the html that will replace the page content
function buildSearchResultsPage(site, query, results, total, page, sort){
    var firstResult = (page - 1) * 10 + 1;
    var lastResult = (page * 10 > total) ? total : page * 10;
    var range = firstResult + " - " + lastResult;
    var sorting = '<div class="sort-results layout-column onethird">' +
                        '<a href="#" id="relevance-sort" class="sort-link '+ (sort == "relevance" ? "active" : "") + '">Sort By Relevance</a>' +
                        ' / ' +
                        '<a href="#" id="date-sort" class="sort-link ' + (sort == "date" ? "active" : "") + '">Sort By Date</a>' +
                    '</div>';

    var globalSearchParams = {
        site: "txstate_no_users",
        client: "txstate",
        output: "xml_no_dtd",
        proxystylesheet: "txstate",
        q: query
    };
    var globalSearchUrl = "http://search.txstate.edu/search?" + jQuery.param(globalSearchParams);

    var html =  '<div id="search-results">' +
                    '<div class="layout-column twothirds">' +
                        '<h1 class="search-results-title" id="maincontent">Search</h1>' +
                    '</div>' +
                    (results.length > 0 ? sorting : "") +
                    '<div class="layout-column twothirds">' +
                        '<div id="search-info" data-site="' + site + '" data-query="' + query + '" data-sort="' + sort + '"></div>' +
                        '<div class="search-again">' +
                            '<form class="searchbar-form">' +
                                '<label class="hidden" for="s">Search Terms</label>' +
                                '<input id="s" type="text" class="search" name="q" value="'+ query +'"></input><button class="icon"><i class="fa fa-search" aria-label="Start Search"></i></button>' +
                            '</form>' +
                            '<button class="icon reset"><i class="fa fa-times" aria-label="Reset Search"></i></button>' +
                        '</div>' +
                        (results.length > 0 ? '<div class="results-count">Results ' + range + ' of about ' + total + ' for ' + query + '.</div>' : "") +
                        formatResults(results) +
                        (results.length > 0 ? buildPagination(query, page, total) : "" ) +
                    '</div><div class="layout-column onethird">' +
                        '<div class="global-search">' +
                            '<div class="all-results-help-text">Didn\'t find what you were looking for?</div>' +
                            buildButton(globalSearchUrl) +
                        '</div>' +
                    '</div>' +
                '</div>';
    return html;
}

//build the results section, either a list of results or a message indicating
//that no results were found
function formatResults(results){
    var html;
    if(results.length == 0){
        html = '<div class="no-results">No Results Found</div>';
    }
    else{
        html = '<div class="results-list">';
        for(var i=0; i<results.length; i++){
            html += '<div class="result">' +
                        '<a class="result-title" href="' + results[i].url +'"><h3>' + results[i].title + '</h3></a>' +
                        '<p class="summary">' + results[i].summary_html + '</p>' +
                        '<a class="result-url-display" href="' + results[i].url + '">' + results[i].url_display + '</a>' +
                    '</div>';
        }
        html += '</div>';
    }
    return html;
}

//build pagination for search results.
function buildPagination(query, currentPage, total){
    var totalPages = Math.ceil(total/10);
    currentPage = parseInt(currentPage);
    var prev = (currentPage > 1) ? '<a class="pagination-link pagination-link-prev" href="#">Prev</a>' : '<span class="nonlink">Prev</span>';
    var next = (currentPage < totalPages) ? '<a class="pagination-link pagination-link-next" href="#">Next</a>' : '<span class="nonlink">Next</span>';
    var html='<div class="pagination show-if-results">' + prev;
    for(var i=Math.max(1,currentPage-3); i<totalPages && i<=currentPage+3; i++){
        //create link for current page and 3 pages before and after current page
        var activeClass = (i == currentPage) ? " active" : "";
        html += '<a class="pagination-link' + activeClass + '" href="#">' + i + '</a>';
    }
    html += next + '</div>';
    return html;
}

function buildButton(url){
    var html='<div class="button-wrapper all-results-button">' +
                '<a class="button three-d color6 medium" href="'+ url +'">' +
                    '<span>Search All Texas State</span>' +
                '</a>' +
             '</div>';
    return html;
}