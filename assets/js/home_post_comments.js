// Let's implement this via classes

// this class would be initialized for every post on the page
// 1. When the page loads
// 2. Creation of every post dynamically via AJAX

class PostComments {
    constructor(postId) {
        this.postId = postId;
        this.postContainer = $(`#post-${postId}`);
        this.newCommentForm = $(`#post-${postId}-comments-form`);

        // Initialize comment creation for the post
        this.createComment();

        // Call deleteComment for all existing comments
        this.postContainer.on('click', '.delete-comment-button', (e) => {
            e.preventDefault(); // Prevent default link behavior
            this.deleteComment($(e.currentTarget));
        });
    }

    // Method to handle new comment creation via AJAX
    createComment() {
        this.newCommentForm.submit((e) => {
            e.preventDefault();
            const self = this;

            $.ajax({
                type: 'post',
                url: '/comments/create',
                data: self.newCommentForm.serialize(),
                success: (data) => {
                    let newComment = self.newCommentDom(data.data.comment);
                    $(`#post-comments-${self.postId}`).prepend(newComment);
                    
                    new ToggleLike($(' .toggle-like-button', newComment));
                    new Noty({
                        theme: 'relax',
                        text: "Comment published!",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                    }).show();
                },
                error: (error) => {
                    console.error(error.responseText);
                    new Noty({
                        theme: 'relax',
                        text: "Error publishing comment!",
                        type: 'error',
                        layout: 'topRight',
                        timeout: 1500
                    }).show();
                }
            });
        });
    }

    // Method to generate the DOM element for a new comment
    newCommentDom(comment) {

        return $(`<li id="comment-${ comment._id }">
            <p>
                
                <small>
                    <a class="delete-comment-button" href="/comments/destroy/${comment._id}">X</a>
                </small>
                
                ${comment.content}
                <br>
                <small>
                    ${comment.user.name}
                </small>
                <small>
                
                    <a class="toggle-like-button" data-likes="0" href="/likes/toggle/?id=${comment._id}&type=Comment">
                        0 Likes
                    </a>
                
                </small>

            </p>    

    </li>`);
}


    // Method to handle comment deletion via AJAX
    deleteComment(deleteLink) {
        $.ajax({
            type: 'get',
            url: deleteLink.prop('href'),
            success: (data) => {
                $(`#comment-${data.data.comment_id}`).remove();

                new Noty({
                    theme: 'relax',
                    text: "Comment Deleted",
                    type: 'success',
                    layout: 'topRight',
                    timeout: 1500
                }).show();
            },
            error: (error) => {
                console.error(error.responseText);
                new Noty({
                    theme: 'relax',
                    text: "Error deleting comment!",
                    type: 'error',
                    layout: 'topRight',
                    timeout: 1500
                }).show();
            }
        });
    }
}
