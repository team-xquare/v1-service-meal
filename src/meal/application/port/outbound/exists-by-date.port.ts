export interface ExistsByDatePort {
    existsByDate(date: Date): Promise<boolean>;
}

export const ExistsByDatePortToken = "ExistsByDatePort";
