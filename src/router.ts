import {Request, Response, Router} from "express"
import path from "path"

import fs, { writeFile } from "fs"
import { compile } from "morgan"

const router: Router = Router()


router.post("/",async (req: Request, res: Response) => {

    let pagePath = path.join(__dirname, "..", "public", "index.html");
    let page = fs.readFileSync(pagePath, "utf8");
    res.send(page)
});

router.post("/makepoll",async (req: Request, res: Response) => {

    console.log(req.body)
    try {
        const pythonBackendUrl = "http://127.0.0.1:5001/polls";
    
        const response = await fetch(pythonBackendUrl,{
            method: "post",
            headers: {
            "Content-type": "application/json"
            },
            body:JSON.stringify({
                question: req.body.question,
                options: req.body.options
            })
        });

        if (!response.ok) {
          res.status(response.status).json({ error: 'Failed to fetch data from Python backend' });
          return;
        }
    
        const data = await response.json();
        res.json(data);
      } catch (error) {
        console.error('Error fetching data from Python:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
});

router.get("/id=:id",async (req: Request, res: Response) => {

    let pollId:string=req.params.id
    try {
        const pythonBackendUrl = "http://127.0.0.1:5003/polls/"+pollId+"/results";
    
        const response = await fetch(pythonBackendUrl,{
            method: "get",
            headers: {
            "Content-type": "application/json"
            },
        });

        if (!response.ok) {
          res.status(response.status).json({ error: 'Failed to fetch data from Python backend' });
          return;
        }
    
        const data = await response.json();
        let pagePath = path.join(__dirname, "..", "public", "openpoll.html");
        let page = fs.readFileSync(pagePath, "utf8");
        page = page.replace("DATA","<script> const jsonString = `"+JSON.stringify(data)+"`</script>");
        console.log(JSON.stringify(data))
        res.send(page)
      } catch (error) {
        console.error('Error fetching data from Python:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
})

router.post("/vote",async (req: Request, res: Response) => {

    let pollId:string = req.body.pollId;
    console.log(req.body)
    try {
        const pythonBackendUrl = "http://127.0.0.1:5002/polls/"+pollId+"/vote";
    
        const response = await fetch(pythonBackendUrl,{
            method: "post",
            headers: {
            "Content-type": "application/json"
            },
            body:JSON.stringify({
                option: req.body.option
            })
        });

        if (!response.ok) {
          res.status(response.status).json({ error: 'Failed to fetch data from Python backend' });
          return;
        }
    
        const data = await response.json();
        res.json(data);
      } catch (error) {
        console.error('Error fetching data from Python:', error);
        res.status(500).json({ error: 'Internal server error' });
      }


});


export default router