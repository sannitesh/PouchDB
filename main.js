/* jshint devel:true */
/* global $,PouchDB, emit */
(function () {
    'use strict';
    var db = new PouchDB('glossary'),
        remoteCouch = false;

    init();

    function init() {
        var param = {
            url: 'glossary.json',
            dataType: 'json',
            cache: false,
            type: 'GET'
        };
        getGlossaryUpdate(param, writeToStore, onError);
    }

    function writeToStore(glossary) {
        db.bulkDocs(glossary).then(function (result) {
            console.log('Row inserted Successfully');
            getGlossary();
        }).catch(function (err) {
            console.log('Unable to insert into DB. Error: ' + err.name + ' - ' + err.message);
        });
    }
    function insertIntoDB(glossary) {
        /*
         * Inserting All the records to database using db.bulkDocs(). 
         * db.bulkDocs() is much faster than db.put().
         */

        db.bulkDocs(glossary).then(function (result) {
            console.log('Row inserted Successfully');
            getGlossary();
            console.log("data inserted");
            //createIndex();
        }).catch(function (err) {
            console.log('Unable to insert into DB. Error: ' + err.name + ' - ' + err.message);
        });
    }
    /*
     * Initially we are suppose to show all the results. Also when nothing is entered in Search Box & user hits Enter key.
     */
    function getGlossary() {
        db.allDocs({
            include_docs: true
        }).then(function (doc) {

            //Showing All the records available in our DB.
            showResult(doc.rows);
        }).catch(function (err) {
            console.log('Unable to Read from Database. Error: ' + err.name + ' - ' + err.message);
        });
    }
    /*
     * Ajax call common function
     */
    function getGlossaryUpdate(param, callBack, error) {
        $.ajax(param)
                .done(callBack)
                .error(error);
    }
    /*
     * Error message
     */
    function onError(errorMsg) {
        showError('Error: not able to fetch glossary from Server');
    }
    /*
     * if any error will occur will pass error message here.
     */
    function showError(message) {
        var searchResult = $('#searchResult');
        var $error = $('<div>', {class: 'text-danger'}).html(message);
        searchResult.append($error);
    }
    /*
     * Preparing Search result HTML code.
     */
    function showResult(result) {
        console.log("show result");
        var searchResult = $('#searchResult');
        var searchResultHeading = $('<h3>', {class: 'text-success searchHeading'}).html('Search Results:');
        searchResult.append(searchResultHeading);
        for(var i=0; i<result.length; i++) {
            if(result[i].highlighting && result[i].highlighting.definition)
                result[i].doc.definition = result[i].highlighting.definition;
            var termContainer = $('<div>', {class: 'searchresult'});
            var name = $('<h4>', {class: 'text-primary'}).html(result[i].doc.name);
            var definition = $('<div>', {class: 'definition'}).html(result[i].doc.definition);
            termContainer.append(name).append(definition);
            searchResult.append(termContainer);
        }
    }
})();