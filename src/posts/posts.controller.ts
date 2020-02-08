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

    private getPostById = async (req:express.Request, res:express.Response, next: express.NextFunction) => {
        const id = req.params.id;
        const post = await this.post.findById(id);

        if(post){
            res.send(post);
        } else {
            next(new PostNotFoundException(id));
        }
        
    }

    private modifyPost = async (req:express.Request, res:express.Response, next: express.NextFunction) => {
        const id = req.params.id;
        const postData: Post = req.body;
        const post = await this.post.findByIdAndUpdate(id, postData, {new: true});

        if(post){
            res.send(post);
        } else {
            next(new PostNotFoundException(id));
        }
    }

    private createPost = async (req:RequestWithUser, res:express.Response) => {
        const postData: CreatePostDto = req.body;
        //const createdPost = new postModel(postData);

        const createPost = new this.post({
            ...postData, 
            author: req.user._id
        });

        const savedPost = await createPost.save();
        await savedPost.populate('author', '-password').execPopulate();
        res.send(savedPost);
    }

    private deletePost = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const id = req.params.id;

        const successResponse = await this.post.findByIdAndDelete(id);

        if(successResponse){
            res.send(200);
        } else {
            next(new PostNotFoundException(id));
        }
    }
}

export default PostsController;
