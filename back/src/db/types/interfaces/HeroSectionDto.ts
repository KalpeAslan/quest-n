export class CreateHeroSectionDto {
  image!: string;
  description!: string;
  priorityNumber!: number;
  projectId!: number;
}

export class UpdateHeroSectionDto {
  image?: string | null;
  description?: string | null;
  priorityNumber?: number | null;
  status?: boolean | null;
  projectId?: number | null;
}
