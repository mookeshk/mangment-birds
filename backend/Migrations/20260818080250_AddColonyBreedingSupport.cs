using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddColonyBreedingSupport : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "MaleBirdId",
                table: "BreedingSessions",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<int>(
                name: "FemaleBirdId",
                table: "BreedingSessions",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<int>(
                name: "CageId",
                table: "BreedingSessions",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_BreedingSessions_CageId",
                table: "BreedingSessions",
                column: "CageId");

            migrationBuilder.AddForeignKey(
                name: "FK_BreedingSessions_Cages_CageId",
                table: "BreedingSessions",
                column: "CageId",
                principalTable: "Cages",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_BreedingSessions_Cages_CageId",
                table: "BreedingSessions");

            migrationBuilder.DropIndex(
                name: "IX_BreedingSessions_CageId",
                table: "BreedingSessions");

            migrationBuilder.DropColumn(
                name: "CageId",
                table: "BreedingSessions");

            migrationBuilder.AlterColumn<int>(
                name: "MaleBirdId",
                table: "BreedingSessions",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "FemaleBirdId",
                table: "BreedingSessions",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);
        }
    }
}
