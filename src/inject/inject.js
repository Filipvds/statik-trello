chrome.extension.sendMessage({}, function(response) {
    var readyStateCheckInterval = setInterval(function() {
        if (document.readyState === "complete") {
            clearInterval(readyStateCheckInterval);

            // Lets find the modal
            var modal = document.querySelector('.window');

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

            var modalObserver = new MutationObserver(function (mutations, observer) {
              renderButton(modal);
            });
            modalObserver.observe(modal, {childList: true, subtree: true});
        }
    }, 10);
});

function showLabels() {
    $('.list').each(function() {
        if (!this.list)
            new List(this);
    });
}
