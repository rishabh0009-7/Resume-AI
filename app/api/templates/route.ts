import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET (request :NextRequest){
    try {
        const {userId } = await auth()

        if(!userId){
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const templates = await prisma.resumeTemplate.findMany({
            where :{
                isActive :true,
                OR :[
                    {userId :null } // default templates 
                    {userId : {not :null}}// user created template 


                ], 
                orderBy :[
                    {isPremium :"desc"},
                    {createdAt :"desc"}
                ]

            }

        })

        return NextResponse.json({templates})
        
    } catch (error) {
        console.error("Error fetching templates:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
        
    }
}


export async function POST(request :NextResponse){
    try {

        const {userId } = await auth ()
        if(!userId){
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        }

        const body = await request.json()
        const{name , description , structure , styling } = body

        const user  = await prisma.user.findUnique({
            where :{clerkId : userId}

        })

        if(!user ){
            return NextResponse.json({ error: "User not found" }, { status: 404 }); 
        }

        const template = await prisma.resumeTemplate.create ({
            data :{
                name,
        description,
        structure,
        styling,
        userId: user.id,

            }
            
            
        })
        return NextResponse.json({template} , {status :201})

} catch (error) {
    console.error("Error creating template:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
        
    }

}


