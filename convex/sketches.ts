import { mutation, query, internalAction, internalMutation } from "./_generated/server";
import Replicate from "replicate";
import { string } from "prop-types";



export const saveSketch = mutation(
    async ({ db, scheduler }, { prompt, image }: { prompt: string, image: string }) => {
        console.log(prompt);
        const sketch = await db.insert("sketches", {
            prompt,
        });
        
        await scheduler.runAfter(0, "sketches:generate", {
            sketchId: sketch._id, 
            prompt,
            image,
        });

        return {
            sketch
        };
    }
);

export const generate = internalAction(
    async (
        {
            runMutation
        }, 
        { 
            prompt,
            image,
            sketchId
        }: { sketchId: Id<string>; prompt: string, image: string }) => {

    const replicate = new Replicate();
    const input = {
        image,
        prompt,
        scale: 7,
        image_resolution: "512",
        n_prompt: "longbody, lowres, bad anatomy, bad hands, missing fingers, extra fingers, cropped, low quality"
    };
    
    const output = await replicate.run("jagilley/controlnet-scribble:435061a1b5a4c1e26740464bf786efdfa9cb3a3ac488595a2de23e143fdb0117", { input });

    await runMutation("sketches:updateSketchResult", {
        sketchId,
        result: output[1]
    })
    console.log(output)
});

export const updateSketchResult = internalMutation(
    async (
        { db },
        { sketchId, result }: { sketchId: Id<string>; result: string }
    ) => {
        await db.patch(sketchId, {
            result
        });
    }
);

export const getSketches = query(async ({ db }) => {
    const sketches = await db.query("sketches").collect();
    return sketches;
});
