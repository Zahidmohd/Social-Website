// Let's implement this via classes

// this class would be initialized for every post on the page
// 1. When the page loads
// 2. Creation of every post dynamically via AJAX

class PostComments{
    constructor(postId){
        this.postId = postId;
        this.postContainer = $(`#post-${postId}`);
        this.newCommentForm = $(`#post-${postId}-comments-form`);

        this.createComment(postId);

        // Call deleteComment for all existing comments
        this.postContainer.on('click', '.delete-comment-button', (e) => {
            this.deleteComment($(e.currentTarget));
        });
    }

    createComment(postId){
        this.newCommentForm.submit((e) => {
            e.preventDefault();
            let self = this;

            $.ajax({
                type: 'post',
                url: '/comments/create',
                data: $(self).serialize(),
                success: (data) => {
                    let newComment = this.newCommentDom(data.data.comment);
                    $(`#post-comments-${postId}`).prepend(newComment);

                    new Noty({
                        theme: 'relax',
                        text: "Comment published!",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                    }).show();
                }, 
                error: (error) => {
                    console.log(error.responseText);
                }
            });
        });
    }

    newCommentDom(comment){
        return $(`
            <li id="comment-${ comment._id }">
                <p>
                    <small>
                        <a class="delete-comment-button" href="/comments/destroy/${comment._id}">X</a>
                    </small>
                    ${comment.content}
                    <br>
                    <small>${comment.user.name}</small>
                </p>
            </li>
        `);
    }

    deleteComment(deleteLink){
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
                console.log(error.responseText);
            }
        });
    }
}
