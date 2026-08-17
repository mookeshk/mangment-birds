using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace backend.Models;

public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<Cage> Cages { get; set; } = null!;
    public DbSet<Bird> Birds { get; set; } = null!;
    public DbSet<BreedingSession> BreedingSessions { get; set; } = null!;
    public DbSet<Egg> Eggs { get; set; } = null!;
    public DbSet<DeathRecord> DeathRecords { get; set; } = null!;
    public DbSet<SaleRecord> SaleRecords { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // Configure relationships and cascading deletes to prevent cycles

        builder.Entity<Bird>()
            .HasOne(b => b.Father)
            .WithMany()
            .HasForeignKey(b => b.FatherId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Entity<Bird>()
            .HasOne(b => b.Mother)
            .WithMany()
            .HasForeignKey(b => b.MotherId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Entity<BreedingSession>()
            .HasOne(bs => bs.MaleBird)
            .WithMany()
            .HasForeignKey(bs => bs.MaleBirdId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Entity<BreedingSession>()
            .HasOne(bs => bs.FemaleBird)
            .WithMany()
            .HasForeignKey(bs => bs.FemaleBirdId)
            .OnDelete(DeleteBehavior.Restrict);
            
        builder.Entity<Egg>()
            .HasOne(e => e.HatchedBird)
            .WithMany()
            .HasForeignKey(e => e.HatchedBirdId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Entity<DeathRecord>()
            .HasOne(dr => dr.Bird)
            .WithMany()
            .HasForeignKey(dr => dr.BirdId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Entity<SaleRecord>()
            .HasOne(sr => sr.Bird)
            .WithMany()
            .HasForeignKey(sr => sr.BirdId)
            .OnDelete(DeleteBehavior.Restrict);

        // Configure User relationships to avoid cascade cycles
        builder.Entity<Cage>().HasOne(c => c.User).WithMany().HasForeignKey(c => c.UserId).OnDelete(DeleteBehavior.Restrict);
        builder.Entity<Bird>().HasOne(b => b.User).WithMany().HasForeignKey(b => b.UserId).OnDelete(DeleteBehavior.Restrict);
        builder.Entity<BreedingSession>().HasOne(bs => bs.User).WithMany().HasForeignKey(bs => bs.UserId).OnDelete(DeleteBehavior.Restrict);
        builder.Entity<Egg>().HasOne(e => e.User).WithMany().HasForeignKey(e => e.UserId).OnDelete(DeleteBehavior.Restrict);
        builder.Entity<DeathRecord>().HasOne(dr => dr.User).WithMany().HasForeignKey(dr => dr.UserId).OnDelete(DeleteBehavior.Restrict);
        builder.Entity<SaleRecord>().HasOne(sr => sr.User).WithMany().HasForeignKey(sr => sr.UserId).OnDelete(DeleteBehavior.Restrict);

        // You could also add Global Query Filters for multi-tenancy later here
    }
}
