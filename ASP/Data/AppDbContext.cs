using Microsoft.EntityFrameworkCore;

namespace ASP.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { 

// Ensure database directory exists in Docker
    var dbPath = Path.Combine(Directory.GetCurrentDirectory(), "data");
    if (!Directory.Exists(dbPath))
    {
        Directory.CreateDirectory(dbPath);
    }


        }

        public DbSet<User> Users { get; set; }
        public DbSet<Admin> Admin { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Explicit mapping
            modelBuilder.Entity<Admin>().ToTable("Admin"); // Critical line
            
            modelBuilder.Entity<Admin>(entity =>
            {
                entity.HasKey(a => a.Id);
                entity.Property(a => a.Email).IsRequired().HasMaxLength(255);
                entity.Property(a => a.Password).IsRequired();
                entity.HasIndex(a => a.Email).IsUnique();
            });

            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(u => u.Id);
                entity.Property(u => u.Email).IsRequired().HasMaxLength(255);
                entity.Property(u => u.Password).IsRequired();
                entity.HasIndex(u => u.Email).IsUnique();
            });
        }
    }

    public class User
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
    }

    public class Admin
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
    }
}