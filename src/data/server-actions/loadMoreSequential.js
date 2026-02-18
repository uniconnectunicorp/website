"use server";

import { paginateSequential } from "@/data/sequential-course";

export async function loadMoreSequential(page) {
  const courses = await paginateSequential(page); 
  return courses;
}
