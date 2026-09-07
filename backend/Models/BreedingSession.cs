namespace backend.Models;
public class BreedingSession
{
    public int Id { get; set; }
    public string UserId { get; set; } = string.Empty;
    public ApplicationUser User { get; set; } = null!;
    
    public int? MaleBirdId { get; set; }
    public Bird? MaleBird { get; set; }
    
    public int? FemaleBirdId { get; set; }
    public Bird? FemaleBird { get; set; }
    
    public int? CageId { get; set; }
    public Cage? Cage { get; set; }
    
    public DateTime MatingDate { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime? EndDate { get; set; }
    
    public ICollection<Egg> Eggs { get; set; } = new List<Egg>();
}
