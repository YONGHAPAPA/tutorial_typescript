import * as express from 'express';
import Post from './posts.interface';
import postModel from './posts.model';
import HttpException from '../exceptions/HttpException';
import PostNotFoundException from '../exceptions/PostNotFoundException';
import validationMiddleware from '../middleware/validation.middleware';
import authMiddleware from '../middleware/auth.middleware';
import CreatePostDto from './post.dto';
import RequestWithUser from 'interfaces/requestWithUser.interface';


class PostsController {
    public path = '/posts';
    public router = express.Router();
    private post = postModel;

    constructor(){
        this.initializeRoutes();
    }

    public initializeRoutes(){
        this.router.get(this.path, this.getAllPosts);
        this.router.get(`${this.path}/:id`, this.getPostById);

        // this.router.patch(`${this.path}/:id`, validationMiddleware(CreatePostDto, true), this.modifyPost);
        // this.router.delete(`${this.path}/:id`, this.deletePost);
        // this.router.post(this.path, validationMiddleware(CreatePostDto), this.createPost);
        this.router
        .all(`${this.path}/*`, authMiddleware)
        .patch(`${this.path}/:id`, validationMiddleware(CreatePostDto, true), this.modifyPost)
        .delete(`${this.path}/:id`, this.deletePost)
        .post(`${this.path}`, authMiddleware, validationMiddleware(CreatePostDto), this.createPost);
    }

    private getAllPosts = (req:express.Request, res:express.Response) => {
        //res.send(this.posts);
        this.post.find()
        .then(posts => {
            res.send(posts);
        });
    }

    private getPostById = (req:express.Request, res:express.Response, next: express.NextFunction) => {
        const id = req.params.id;
        this.post.findById(id)
        .then(post => {
            if(post){
                res.send(post);
            } else {
                //res.status(404).send({ error: 'Post not found' });
                //next(new HttpException(404, 'Post not found'));
                next(new PostNotFoundException(id));
                //res.send(new HttpException(404, 'Post not found'));
            }
        })
    }

    private modifyPost = (req:express.Request, res:express.Response, next: express.NextFunction) => {
        const id = req.params.id;
        const postData: Post = req.body;
        this.post.findByIdAndUpdate(id, postData, {new: true})
        .then(post => {
            //res.send(post);
            if(post){
                res.send(post);
            } else {
                next(new PostNotFoundException(id))
            }
        });
    }

    private createPost = async (req:RequestWithUser, res:express.Response) => {
        const postData: CreatePostDto = req.body;
        //const createdPost = new postModel(postData);
        const createPost = new this.post({
            ...postData, 
            authorId: req.user._id
        });

        // createdPost.save()
        // .then(savedPost => {
        //     res.send(savedPost);
        // });
        const savedPost = await createPost.save();
        res.send(savedPost);
    }

    private deletePost = (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const id = req.params.id;

        this.post.findByIdAndDelete(id)
        .then(result => {
            if(result){
                res.send(200);
            } else {
                //res.send(404);
                next(new PostNotFoundException(id));
            }
        })
    }
}

export default PostsController;
