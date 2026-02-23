"use server";

import { paginate } from "@/data/course";

export async function loadMore(page, aproveitamento = false) {
  const courses = await paginate(page, aproveitamento); 
  return courses;
}