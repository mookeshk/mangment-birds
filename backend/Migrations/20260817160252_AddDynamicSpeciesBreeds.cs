using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddDynamicSpeciesBreeds : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Type",
                table: "Birds");

            migrationBuilder.AddColumn<int>(
                name: "BreedId",
                table: "Birds",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "SpeciesId",
                table: "Birds",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Species",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Species", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Species_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Breeds",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    SpeciesId = table.Column<int>(type: "int", nullable: false),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Breeds", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Breeds_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Breeds_Species_SpeciesId",
                        column: x => x.SpeciesId,
                        principalTable: "Species",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Birds_BreedId",
                table: "Birds",
                column: "BreedId");

            migrationBuilder.CreateIndex(
                name: "IX_Birds_SpeciesId",
                table: "Birds",
                column: "SpeciesId");

            migrationBuilder.CreateIndex(
                name: "IX_Breeds_SpeciesId",
                table: "Breeds",
                column: "SpeciesId");

            migrationBuilder.CreateIndex(
                name: "IX_Breeds_UserId",
                table: "Breeds",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Species_UserId",
                table: "Species",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Birds_Breeds_BreedId",
                table: "Birds",
                column: "BreedId",
                principalTable: "Breeds",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Birds_Species_SpeciesId",
                table: "Birds",
                column: "SpeciesId",
                principalTable: "Species",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Birds_Breeds_BreedId",
                table: "Birds");

            migrationBuilder.DropForeignKey(
                name: "FK_Birds_Species_SpeciesId",
                table: "Birds");

            migrationBuilder.DropTable(
                name: "Breeds");

            migrationBuilder.DropTable(
                name: "Species");

            migrationBuilder.DropIndex(
                name: "IX_Birds_BreedId",
                table: "Birds");

            migrationBuilder.DropIndex(
                name: "IX_Birds_SpeciesId",
                table: "Birds");

            migrationBuilder.DropColumn(
                name: "BreedId",
                table: "Birds");

            migrationBuilder.DropColumn(
                name: "SpeciesId",
                table: "Birds");

            migrationBuilder.AddColumn<int>(
                name: "Type",
                table: "Birds",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
