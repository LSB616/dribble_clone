"use client"

import { SessionInterface } from "@/common.types";
import { ChangeEvent } from "react";
import Image from "next/image";
import FormField from "./FormField";
import { categoryFilters } from "@/constants";
import CustomMenu from "./CustomMenu";
import { useState } from "react";

type Props = {
    type: string,
    session: SessionInterface
}

const ProjectForm = ( { type, session }: Props ) => {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [form, setForm] = useState({
        image: '',
        title: '',
        description: '',
        liveSiteUrl: '',
        githubUrl: '',
        category: ''
    });

    const handleFormSubmit = (e: React.FormEvent) => {}
    const handleChangeImage = (e: ChangeEvent<HTMLInputElement>) => {}
    const handleStateChange = (fieldName: string, value: string) => {
        setForm((prevState) => ({...prevState, [fieldName]: value}))
    }
    

  return (
    <form onSubmit={handleFormSubmit} className="flexStart form"> 
        <div className="flexStart form_image-container">
            <label htmlFor="poster" className="flexCenter form_image-label">
                {!form.image && 'Chose a Poster For Your Project'}
            </label>
            <input id="image"  type="file" accept="image/*" required={type === 'create'} className="form_image-input" onChange={handleChangeImage}/>
            {form.image && (
                <Image src={form?.image} className="sm:p-10 object-contain z-20" alt="project poster" fill/>
            )}
        </div>
        <FormField title="Title" state={form.title} placeholder="Title" setState={(value) => handleStateChange('title', value)}/>
        <FormField title="Description" state={form.description} placeholder="Describe Your Remarkable Developer Project." setState={(value) => handleStateChange('description', value)}/>
        <FormField type="url "title="Website URL" state={form.liveSiteUrl} placeholder="https://yourproject.com" setState={(value) => handleStateChange('liveSiteUrl', value)}/>
        <FormField type="url" title="GitHub URL" state={form.githubUrl} placeholder="https://github.com/yourid" setState={(value) => handleStateChange('githubUrl', value)}/>
        <CustomMenu title="Category" state={form.category} filters={categoryFilters} setState={(value) => handleStateChange('category', value)}/>
        <div className="flexStart w-full">
            <button>Create</button>
        </div>
    </form>
  )
}

export default ProjectForm