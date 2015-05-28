var readyStateCheckInterval = setInterval(function() {
    if (document.readyState === "complete") {
        clearInterval(readyStateCheckInterval);

        // Lets find the modal
        var body = document.body,
            boardWrapper = document.querySelector('.board-wrapper'),
            modal = document.querySelector('.window'),
            timelyProjects = [],
            timelyCards = [];

        var renderButton = function(modal) {
            // prepare the activity actions
            var actions = modal.querySelector('.js-list-actions:not(.statik-trello)');
            if(actions) {
                actions.insertAdjacentHTML('beforebegin', '<div class="gutter actions-filter">Filter: </div>');

                var filterActionsContainer = modal.querySelector('.actions-filter');

                var toggleCommentsBtn = document.createElement('a');
                toggleCommentsBtn.href = '#';
                toggleCommentsBtn.innerHTML = 'Comments';
                toggleCommentsBtn.classList.toggle('quiet-button');

                filterActionsContainer.appendChild(toggleCommentsBtn);

                // Only show the comments by default
                actions.classList.toggle('only-comments');
                toggleCommentsBtn.classList.toggle('active');

                // add the event to the button click
                toggleCommentsBtn.addEventListener('click', function(event){
                    actions.classList.toggle('only-comments');
                    this.classList.toggle('active');
                    return false;
                });
                actions.classList.toggle('statik-trello');
            }
        };

        var initTimely = function() {
            var path = window.location.pathname.split('/');
            // console.log(path);
            switch(path[1]) {
                case 'b':
                    var projectCode = path[3].split('-')[0].toUpperCase();
                    if(timelyProjects[projectCode] === undefined) {
                        chrome.runtime.sendMessage({
                            action: 'xhttp',
                            url: 'http://intcol.staging.statik.be/timely/projects/' + projectCode
                        }, function(responseText) {
                            timelyProjects[projectCode] = JSON.parse(responseText);
                            renderTimelyBoard(timelyProjects[projectCode]);
                        });
                    } else {
                        renderTimelyBoard(timelyProjects[projectCode]);
                    }

                    break;
                case 'c':

                    break;
            }
        };

        var renderTimelyBoard = function(obj) {
            if (!obj.budget) return;

            var $header = $('.board-header'),
                $timleyItem = $header.find('.board-header-timely');

            if($header.length && $timleyItem.length === 0) {
                var percentage = roundToTwo((obj.total_logged.cost / obj.budget) * 100);
                var $timely = $('<span class="board-header-btn board-header-timely"><span class="icon-sm icon-clock board-header-btn-icon"/><span class="board-header-btn-text">' + percentage + '%</span></span>');

                $header.append($timely);
            }
        };

        var modalObserverHeader = new MutationObserver(function (mutations, observer) {
            initTimely();
        });
        modalObserverHeader.observe(document.getElementById('content'), {childList: true});

        var modalObserverModal = new MutationObserver(function (mutations, observer) {
            renderButton(modal);
        });
        modalObserverModal.observe(modal, {childList: true, subtree: true});

        initTimely();
    }
}, 10);

// @1
// $1
// _1

function roundToTwo(num) {
    return +(Math.round(num + "e+2")  + "e-2");
}

function showLabels() {
    $('.list').each(function() {
        if (!this.list)
            new List(this);
    });
}

(function() {
    var path = window.location.pathname.split('/');
    if(path[1] === 'b') {
        $.getJSON('https://trello.com/1/Boards/' + path[2] + '?lists=all&cards=visible&card_attachments=cover&card_stickers=true&card_fields=badges%2Cclosed%2CdateLastActivity%2Cdesc%2CdescData%2Cdue%2CidAttachmentCover%2CidList%2CidBoard%2CidMembers%2CidShort%2Clabels%2CidLabels%2Cname%2Cpos%2CshortUrl%2CshortLink%2Csubscribed%2Curl', function(data) {
            $.each(data.cards, function(index, values) {
                if(values.due) {
                    var $link = $('a[href*=' + values.shortLink + ']'),
                        $cards = $link.parent();

                    var date1 = new Date();
                    var date2 = new Date(values.due);
                    var timeDiff = Math.abs(date2.getTime() - date1.getTime());
                    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                    // console.log(date2.getTime() - date1.getTime());
                }
            });
        });
    }
})();
