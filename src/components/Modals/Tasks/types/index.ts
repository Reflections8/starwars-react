export type TaskType = {
  key: string;
  type: "gaming" | "social";
  header: {
    title_ru: string;
    title_en: string;
  };
  content: [
    {
      id: number;
      title_ru: string;
      title_en: string;
      link_en: string;
      link_ru: string;
      has_progress_bar: boolean;
      current_progress: number;
      max_progress: number;
      reward: number;
      completed: boolean;
      was_sent: boolean;
    }
  ];
};
