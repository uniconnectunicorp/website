"use server";

import { paginate } from "@/data/course";

export async function loadMore(page) {
  const courses = await paginate(page); 
  return courses;
}